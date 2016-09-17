/* eslint no-param-reassign: 0, yoda: 0 */

module.exports = (md) => {
  md.inline.ruler.before('html_inline', 'br', (state, silent) => {
    const pos = state.pos;

    if (pos + 4 > state.posMax) {
      return false;
    }

    if (state.src.charCodeAt(pos) !== 0x3C/* < */) {
      return false;
    }

    if (!/<br>/i.test(state.src.slice(pos, pos + 4))) {
      return false;
    }

    if (!silent) {
      const token = state.push('html_inline', '', 0);
      token.content = '<br>';
    }

    state.pos = pos + 4;

    return true;
  });
};
