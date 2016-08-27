import { expect } from 'chai';
import path from 'path';
import fs from 'fs';

import bibtex from '../bibtex';

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

    it('should deal with empty authors', () => {
      const authors = '';
      const result = bibtex.normalizeAuthors(authors);

      expect(result).to.have.length(0);
    });

    it('should normalize only a lastname', () => {
      const authors = 'Durand';
      const result = bibtex.normalizeAuthors(authors);

      expect(result).to.have.length(1);
      expect(result[0]).to.eql({ fullname: 'Durand', lastname: 'Durand' });
    });

    it('should normalize only lastnames', () => {
      const authors = 'Durand and Salva';
      const result = bibtex.normalizeAuthors(authors);

      expect(result).to.have.length(2);
      expect(result[0]).to.eql({ fullname: 'Durand', lastname: 'Durand' });
      expect(result[1]).to.eql({ fullname: 'Salva', lastname: 'Salva' });
    });
  });

  describe('parse()', () => {
    it('should parse inproceedings', () => {
      const [content, expected] = fixture('inproceedings');
      const result = bibtex.parse(content);

      expect(result).to.have.length(1);
      expect(result[0].html).to.equal(expected);
    });

    it('should parse articles', () => {
      const [content, expected] = fixture('article');
      const result = bibtex.parse(content);

      expect(result).to.have.length(1);
      expect(result[0].html).to.equal(expected);
    });

    it('should parse multiple bibtex entries', () => {
      const [content, expected] = fixture('multi-entries');
      const result = bibtex.parse(content);

      expect(result).to.have.length(2);
      expect(result.map((e) => e.html).join('\n\n')).to.equal(expected);
    });

    it('should parse books', () => {
      const [content, expected] = fixture('book');
      const result = bibtex.parse(content);

      expect(result).to.have.length(1);
      expect(result[0].html).to.equal(expected);
    });

    it('should parse misc (fallback)', () => {
      const [content, expected] = fixture('misc');
      const result = bibtex.parse(content);

      expect(result).to.have.length(1);
      expect(result[0].html).to.equal(expected);
    });

    it('should return the same entry exactly once', () => {
      const [content, expected] = fixture('multi-same');
      const result = bibtex.parse(content);

      expect(result).to.have.length(2);
      expect(result.map((e) => e.html).join('\n\n')).to.equal(expected);
    });

    it('should sort the entries', () => {
      const [content, expected] = fixture('multi-unsorted');
      const result = bibtex.parse(content);

      expect(result).to.have.length(2);
      expect(result.map((e) => e.html).join('\n\n')).to.equal(expected);
    });

    it('should not emit errors when parsing has failed', () => {
      const [content, expected] = fixture('partial');
      const result = bibtex.parse(content);

      expect(result).to.have.length(0);
    });

    // TODO: for now, we have to keep such a limitation...
    it('cannot return any result when parsing has failed', () => {
      const [content, expected] = fixture('multi-partial');
      const result = bibtex.parse(content);

      expect(result).to.have.length(0);
    });

    it('should deal with no author in an entry', () => {
      const [content, expected] = fixture('missing-author-field');
      const result = bibtex.parse(content);

      expect(result).to.have.length(1);
      expect(result.map((e) => e.html).join('\n\n')).to.equal(expected);
    });

    it('should deal with a single author in an entry', () => {
      const [content, expected] = fixture('single-author');
      const result = bibtex.parse(content);

      expect(result).to.have.length(1);
      expect(result.map((e) => e.html).join('\n\n')).to.equal(expected);
    });
  });

  describe('html.renderReferences()', () => {
    it('should format the keys of a set of citations', () => {
      const [content, _] = fixture('multi-entries');
      const result = bibtex.html.renderReferences(bibtex.parse(content));

      expect(result).to.equal('(Durand & Salva, 2015; Hodge & Austin, 2004)');
    });

    it('should deal with empty authors', () => {
      const [content, _] = fixture('no-authors');
      const result = bibtex.html.renderReferences(bibtex.parse(content));

      expect(result).to.equal('(Unknown authors, 2007)');
    });

    // TODO: implement this feature
    it.skip('should handle same authors with different dates', () => {
      const [content, _] = fixture('multi-same-authors-diff-dates');
      const result = bibtex.html.renderReferences(bibtex.parse(content));

      expect(result).to.equal('(Li & Durbin, 2009, 2010)');
    });
  });
});
