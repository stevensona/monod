import path from 'path';
import generate from 'markdown-it-testgen';
import markdownIt from 'markdown-it';
import kbd from '../kbd';

// see: https://github.com/mochajs/mocha/issues/1847
const { describe } = global;


describe('markdown-it-plugins/kbd', () => {
  const mdIt = markdownIt().use(kbd);

  generate(path.join(__dirname, 'fixtures/kbd.txt'), { header: true }, mdIt);
});
