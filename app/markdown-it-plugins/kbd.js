/* eslint no-param-reassign: 0, yoda: 0, no-continue: 0 */

module.exports = (md) => {
  // renderer for kbd token `[[key]]`
  md.renderer.rules.kbd = (tokens, idx) => `<kbd>${md.utils.escapeHtml(tokens[idx].content)}</kbd>`;

  // inline rule to parse keys `[[key]]`
  md.inline.ruler.after('emphasis', 'kbd', (state, silent) => {
    let pos;
    let token;
    const max = state.posMax;
    const start = state.pos;

    // should be at least 5 chars - "[[x]]"
    if (start + 5 > max) { return false; }

    if (state.src.charCodeAt(start) !== 0x5B/* [ */) { return false; }
    if (state.src.charCodeAt(start + 1) !== 0x5B/* [ */) { return false; }

    for (pos = start + 2; pos < max; pos++) {
      if (state.src.charCodeAt(pos) === 0x20) { return false; }
      if (state.src.charCodeAt(pos) === 0x0A) { return false; }
      if (state.src.charCodeAt(pos) === 0x5D && state.src.charCodeAt(pos - 1) === 0x5D /* ] */) {
        break;
      }
    }

    if (pos === start + 3) { return false; } // no empty keys
    if (pos >= max) { return false; }

    pos++;

    const content = state.src.slice(start + 2, pos - 2);


    if (!silent) {
      token = state.push('kbd', '', 0);
      token.content = content;
    }

    state.pos = pos;
    state.posMax = max;

    return true;
  });
};
