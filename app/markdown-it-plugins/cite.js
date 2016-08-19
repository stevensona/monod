/* eslint no-param-reassign: 0, yoda: 0, no-continue: 0 */
import Bibtex from '../bibtex';


module.exports = (md) => {
  const defaultRender = md.renderer.rules.fence;
  const bibtex = new Bibtex();

  // override fence renderer for `cite`
  md.renderer.rules.fence = (tokens, idx, options, env, self) => {
    const token = tokens[idx];

    if ('cite' === token.info) {
      const entries = bibtex.parse(md.utils.escapeHtml(token.content));

      return entries.map(
        (entry) => `<p class="citation">${entry.html}</p>`
      ).join('\n');
    }

    // pass token to default renderer.
    return defaultRender(tokens, idx, options, env, self);
  };

  // renderer for cite references `[@citation_ref]`
  md.renderer.rules.cite_ref = (tokens, idx) => { // also take: options, env, self
    const token = tokens[idx];
    const key = token.meta.key;

    if (!token.meta.htmlKey || null === token.meta.htmlKey) {
      return `<span title="This reference is invalid" class="invalid-ref">[@${key}]</span>`;
    }

    return token.meta.htmlKey;
  };

  // override fence block parser
  md.block.ruler.at('fence', (state, startLine, endLine, silent) => {
    let len;
    let nextLine;
    let mem;
    let haveEndMarker = false;
    let pos = state.bMarks[startLine] + state.tShift[startLine];
    let max = state.eMarks[startLine];

    if (pos + 3 > max) { return false; }

    const marker = state.src.charCodeAt(pos);

    if (marker !== 0x7E/* ~ */ && marker !== 0x60 /* ` */) {
      return false;
    }

    // scan marker length
    mem = pos;
    pos = state.skipChars(pos, marker);

    len = pos - mem;

    if (len < 3) { return false; }

    const markup = state.src.slice(mem, pos);
    const params = state.src.slice(pos, max);

    if (params.indexOf('`') >= 0) { return false; }

    // Since start is found, we can report success here in validation mode
    if (silent) { return true; }

    // search end of block
    nextLine = startLine;

    for (;;) {
      nextLine++;
      if (nextLine >= endLine) {
        // unclosed block should be autoclosed by end of document.
        // also block seems to be autoclosed by end of parent
        break;
      }

      pos = mem = state.bMarks[nextLine] + state.tShift[nextLine];
      max = state.eMarks[nextLine];

      if (pos < max && state.sCount[nextLine] < state.blkIndent) {
        // non-empty line with negative indent should stop the list:
        // - ```
        //  test
        break;
      }

      if (state.src.charCodeAt(pos) !== marker) { continue; }

      if (state.sCount[nextLine] - state.blkIndent >= 4) {
        // closing fence should be indented less than 4 spaces
        continue;
      }

      pos = state.skipChars(pos, marker);

      // closing code fence must be at least as long as the opening one
      if (pos - mem < len) { continue; }

      // make sure tail has spaces only
      pos = state.skipSpaces(pos);

      if (pos < max) { continue; }

      haveEndMarker = true;
      // found!
      break;
    }

    // If a fence has heading spaces, they should be removed from its inner block
    len = state.sCount[startLine];

    state.line = nextLine + (haveEndMarker ? 1 : 0);

    const token = state.push('fence', 'code', 0);
    token.info = params;
    token.content = state.getLines(startLine + 1, nextLine, len, true);
    token.markup = markup;
    token.map = [startLine, state.line];

    if (!state.env.citations) {
      state.env.citations = [];
    }

    if ('cite' === token.info) {
      state.env.citations = state.env.citations.concat(
        bibtex.parse(md.utils.escapeHtml(token.content))
      );
    }

    return true;
  }, { alt: ['paragraph', 'reference', 'blockquote', 'list'] });

  // inline rule to parse citation references `[@citation]`
  md.inline.ruler.after('image', 'cite_ref', (state, silent) => {
    let pos;
    let token;
    const max = state.posMax;
    const start = state.pos;

    // should be at least 4 chars - "[^x]"
    if (start + 3 > max) { return false; }

    if (!state.env.citations) { return false; }
    if (state.src.charCodeAt(start) !== 0x5B/* [ */) { return false; }
    if (state.src.charCodeAt(start + 1) !== 0x40/* @ */) { return false; }

    for (pos = start + 2; pos < max; pos++) {
      if (state.src.charCodeAt(pos) === 0x20) { return false; }
      if (state.src.charCodeAt(pos) === 0x0A) { return false; }
      if (state.src.charCodeAt(pos) === 0x5D /* ] */) {
        break;
      }
    }

    if (pos === start + 2) { return false; } // no empty cite keys
    if (pos >= max) { return false; }

    pos++;

    const key = state.src.slice(start + 2, pos - 1);
    const citation = state.env.citations.find((entry) => entry.key === key);

    if (!silent) {
      token = state.push('cite_ref', '', 0);
      token.meta = { key, htmlKey: undefined !== citation ? citation.htmlKey : null };
    }

    state.pos = pos;
    state.posMax = max;

    return true;
  });
};
