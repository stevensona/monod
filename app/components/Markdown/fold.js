/* eslint new-cap: 0 */
import CodeMirror from 'codemirror';


// We register a 'markdown' fold function so that is is automatically used by
// CodeMirror as we set `gfm` as mode in the Markdown (React) component.
CodeMirror.registerHelper('fold', 'markdown', (cm, start) => {
  // link must be on a single line
  const line = start.line;
  const lineText = cm.getLine(line);

  // find opening Markdown link
  const index = lineText.lastIndexOf('](');

  if (-1 === index) {
    return null;
  }

  // check that it is an image, not an simple URL
  if (!/\bimage\b/.test(cm.getTokenTypeAt(CodeMirror.Pos(line, index)))) {
    return null;
  }

  const startCh = index + 2;

  // check that the content we want to fold is an URL
  if (!/\burl\b/.test(cm.getTokenTypeAt(CodeMirror.Pos(line, startCh)))) {
    return null;
  }

  const endCh = lineText.indexOf(')');

  if (-1 === endCh) {
    return null;
  }

  return {
    from: CodeMirror.Pos(line, startCh),
    to: CodeMirror.Pos(line, endCh),
  };
});
