import parser from 'bibtex-parse-js';


export default class Bibtex {

  parse(bibtex) {
    const entries = parser.toJSON(bibtex);

    const keys = [];
    const results = [];
    for (let i = 0; i < entries.length; i++) {
      const e = entries[i];
      const key = e.citationKey;
      const firstAuthor = this.getFirstAuthor(e.entryTags.author);

      if (undefined === keys.find((k) => key === k)) {
        keys.push(key);

        results.push({
          key,
          firstAuthor,
          html: this.formatHtmlEntry(e.entryType, e.entryTags),
          htmlKey: this.formatHtmlKey(firstAuthor, e.entryTags.year),
        });
      }
    }

    return results
      .sort((e1, e2) =>
        e1.firstAuthor.lastname.localeCompare(e2.firstAuthor.lastname)
      )
      .map((e) => (
        { key: e.key, html: e.html, htmlKey: e.htmlKey }
      ));
  }

  formatHtmlEntry(type, data) {
    let content;
    switch (type.toLowerCase()) {
      case 'inproceedings':
        content = [
          `${this.formatAuthors(data.author)} (${data.year}). ${data.title}.`,
          `In <em>${data.booktitle}</em> (pp. ${data.pages}). ${this.urlize(data.url)}`,
        ].join(' ');
        break;

      case 'article':
        content = [
          `${this.formatAuthors(data.author)} (${data.year}).`,
          `${data.title}.`,
          `<em>${data.journal}</em>,`,
          `${data.volume}${this.optional(data.issue, data.number)},`,
          `${data.pages}.`,
          `${this.urlizeDOI(data.doi)}`,
        ].join(' ');
        break;

      case 'book':
        content = [
          `${this.formatAuthors(data.author)} (${data.year}).`,
          `<em>${data.title}</em>.`,
          `${data.publisher}`,
        ].join(' ');
        break;

      case 'misc':
      default:
        content = [
          `${this.formatAuthors(data.author)} (${data.year}).`,
          `${data.title}.`,
          `${data.note || ''}`,
        ].join(' ');

    }

    return this.replaceLaTeXChars(content);
  }

  getFirstAuthor(authors) {
    return this.normalizeAuthors(authors)[0];
  }

  formatHtmlKey(firstAuthor, year) {
    return `(${firstAuthor.lastname} <em>et al.</em>, ${year})`;
  }

  normalizeAuthors(authors) {
    const parts = authors.split(/\sand\s/);

    return parts.map((fullname) => {
      let otherNames;
      let lastname;
      if (/,/.test(fullname)) {
        const subparts = fullname.split(/,/);
        lastname = subparts[0].trim();
        otherNames = subparts[1];
      } else {
        const subparts = fullname.split(/\s/);
        lastname = subparts[subparts.length - 1].trim();
        otherNames = subparts.slice(0, subparts.length - 1).join(' ');
      }

      otherNames = otherNames
        .trim()
        .split(/\s/)
        .filter((p) => '' !== p)
        .map((p) =>
          `${p.charAt(0).toUpperCase()}.`
        )
        .join(' ');

      return {
        fullname: `${lastname}, ${otherNames}`,
        lastname,
      };
    });
  }

  formatAuthors(authors) {
    const normalizedAuthors = this.normalizeAuthors(authors);
    const truncate = 6 < normalizedAuthors.length;

    let authorsToDisplay = normalizedAuthors;
    if (truncate) {
      authorsToDisplay = normalizedAuthors.splice(0, 6);
    }

    // because we have to put `author, author, author & last author name`
    const lastAuthorToDisplay = authorsToDisplay.pop();

    let authorsString = authorsToDisplay
      .map((a) => a.fullname)
      .join(', ')
      .concat(` & ${lastAuthorToDisplay.fullname}`);

    if (truncate) {
      authorsString += ' et al.';
    }

    return this.replaceLaTeXChars(authorsString);
  }

  optional(string, fallback) {
    let str = string;

    if (undefined === str) {
      str = fallback;
    }

    return undefined !== str ? `(${str})` : '';
  }

  urlizeDOI(string) {
    let str = string;
    if (!/^https?:\/\//.test(str)) {
      str = `http://dx.doi.org/${str}`;
    }

    return this.urlize(str);
  }

  urlize(string) {
    if (/^https?:\/\//.test(string)) {
      return `<a href="${string}" rel="noreferrer noopener">${string}</a>`;
    }

    return string;
  }

  replaceLaTeXChars(string) {
    return string
      .replace(/\\'e/g, 'é')
      .replace(/\\'\{e\}/g, 'é')
      .replace(/\{/g, '')
      .replace(/\}/g, '')
      .replace(/--/g, '—')
      .replace(/\s+/g, ' ')
    ;
  }
}
