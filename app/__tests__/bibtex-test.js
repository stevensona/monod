import { expect } from 'chai';
import path from 'path';
import fs from 'fs';

import Bibtex from '../bibtex';

// see: https://github.com/mochajs/mocha/issues/1847
const { describe, it } = global;


function fixture(name) {
  const content = fs.readFileSync(
    path.join(__dirname, `./fixtures/bib/${name}.bib`),
    { encoding: 'utf8' }
  );

  return content
    .split('--- EXPECTED ---\n')
    .map((part) => part.trim());
}

describe('bibtex', () => {
  const bibtex = new Bibtex();

  describe('normalizeAuthors()', () => {
    it('should normalize an author without comma and multiple names', () => {
      const authors = 'Victoria J. Hodge';
      const result = bibtex.normalizeAuthors(authors);

      expect(result).to.have.length(1);
      expect(result[0]).to.eql({ fullname: 'Hodge, V. J.', lastname: 'Hodge' });
    });

    it('should normalize an author without comma', () => {
      const authors = 'William Durand';
      const result = bibtex.normalizeAuthors(authors);

      expect(result).to.have.length(1);
      expect(result[0]).to.eql({ fullname: 'Durand, W.', lastname: 'Durand' });
    });

    it('should normalize multiple authors without comma', () => {
      const authors = 'William Durand and Sebastien Salva';
      const result = bibtex.normalizeAuthors(authors);

      expect(result).to.have.length(2);
      expect(result[0]).to.eql({ fullname: 'Durand, W.', lastname: 'Durand' });
      expect(result[1]).to.eql({ fullname: 'Salva, S.', lastname: 'Salva' });
    });

    it('should normalize multiple authors with comma', () => {
      const authors = 'Hunter, Sarah and Corbett, Matthew and Denise, Hubert';
      const result = bibtex.normalizeAuthors(authors);

      expect(result).to.have.length(3);
      expect(result[0]).to.eql({ fullname: 'Hunter, S.', lastname: 'Hunter' });
      expect(result[1]).to.eql({ fullname: 'Corbett, M.', lastname: 'Corbett' });
      expect(result[2]).to.eql({ fullname: 'Denise, H.', lastname: 'Denise' });
    });
  });

  describe('getFirstAuthor()', () => {
    it('should return the first author', () => {
      const result = bibtex.getFirstAuthor('William Durand and Sebastien Salva');

      expect(result).to.eql({ fullname: 'Durand, W.', lastname: 'Durand' });
    });

    it('should return the first author', () => {
      const authors = 'Victoria J. Hodge';
      const result = bibtex.getFirstAuthor(authors);

      expect(result).to.eql({ fullname: 'Hodge, V. J.', lastname: 'Hodge' });
    });

    it('should return the first author', () => {
      const authors = 'Hunter, Sarah and Corbett, Matthew';
      const result = bibtex.getFirstAuthor(authors);

      expect(result).to.eql({ fullname: 'Hunter, S.', lastname: 'Hunter' });
    });
  });

  describe('parse()', () => {
    it('should parse inproceedings', () => {
      const [ content, expected ] = fixture('inproceedings');
      const result = (new Bibtex()).parse(content);

      expect(result).to.have.length(1);
      expect(result[0].html).to.equal(expected);
    });

    it('should parse articles', () => {
      const [ content, expected ] = fixture('article');
      const result = (new Bibtex()).parse(content);

      expect(result).to.have.length(1);
      expect(result[0].html).to.equal(expected);
    });

    it('should parse multiple bibtex entries', () => {
      const [ content, expected ] = fixture('multi-entries');
      const result = (new Bibtex()).parse(content);

      expect(result).to.have.length(2);
      expect(result.map((e) => e.html).join('\n\n')).to.equal(expected);
    });

    it('should parse books', () => {
      const [ content, expected ] = fixture('book');
      const result = (new Bibtex()).parse(content);

      expect(result).to.have.length(1);
      expect(result[0].html).to.equal(expected);
    });

    it('should parse misc (fallback)', () => {
      const [ content, expected ] = fixture('misc');
      const result = (new Bibtex()).parse(content);

      expect(result).to.have.length(1);
      expect(result[0].html).to.equal(expected);
    });

    it('should return the same entry exactly once', () => {
      const [ content, expected ] = fixture('multi-same');
      const result = (new Bibtex()).parse(content);

      expect(result).to.have.length(2);
      expect(result.map((e) => e.html).join('\n\n')).to.equal(expected);
    });
  });
});
