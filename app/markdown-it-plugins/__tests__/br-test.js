import path from 'path';
import generate from 'markdown-it-testgen';
import markdownIt from 'markdown-it';
import br from '../br';

// see: https://github.com/mochajs/mocha/issues/1847
const { describe } = global;


describe('markdown-it-plugins/br', () => {
  const mdIt = markdownIt().use(br);

  generate(path.join(__dirname, 'fixtures/br.txt'), { header: true }, mdIt);
});
