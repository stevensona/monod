import path from 'path';
import generate from 'markdown-it-testgen';
import markdownIt from 'markdown-it';
import cite from '../cite';

// see: https://github.com/mochajs/mocha/issues/1847
const { describe } = global;


describe('markdown-it-plugins/cite', () => {
  const mdIt = markdownIt().use(cite);

  generate(path.join(__dirname, 'fixtures/cite.txt'), { header: true }, mdIt);
});
