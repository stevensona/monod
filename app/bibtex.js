import parser from 'bibtex-parse-js';


// constants
const MAX_AUTHORS_IN_REFS = 2;
const MAX_AUTHORS_IN_CITATIONS = 6;
const UNKNOWN_AUTHORS = 'Unknown authors';

// utils

function optional(string, fallback) {
  const str = undefined === string ? fallback : string;

  return undefined !== str ? `(${str})` : '';
}

function linkify(string) {
  if (/^https?:\/\//.test(string)) {
    return `<a href="${string}" rel="noreferrer noopener">${string}</a>`;
  }

  return string;
}

function linkifyDOI(string) {
  let str = string;
  if (!/^https?:\/\//.test(str)) {
    str = `http://dx.doi.org/${str}`;
  }

  return linkify(str);
}

function replaceLaTeXChars(string) {
  // TODO: need more replacements
  return string
    .replace(/\\'e/g, 'é')
    .replace(/\\'\{e\}/g, 'é')
    .replace(/\{/g, '')
    .replace(/\}/g, '')
    .replace(/--/g, '—')
    .replace(/\s+/g, ' ')
  ;
}

// sorting

// first author's latname, then year
function sortCitations(e1, e2) {
  let r = e1.authors[0].lastname.localeCompare(e2.authors[0].lastname);

  if (0 === r) {
    r = e1.year < e2.year ? -1 : 1;
  }

  return r;
}

// formatters

function normalizeAuthors(authors) {
  const parts = authors ? authors.split(/\sand\s/) : [];

  return parts
    .filter(fullname => '' !== fullname)
    .map((fullname) => {
      let lastname;
      let otherNames;
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
        fullname: '' !== otherNames ? `${lastname}, ${otherNames}` : lastname,
        lastname,
      };
    });
}

function formatAuthors(authors) {
  const normalizedAuthors = normalizeAuthors(authors);

  if (0 === normalizedAuthors.length) {
    return UNKNOWN_AUTHORS;
  }

  const truncate = MAX_AUTHORS_IN_CITATIONS < normalizedAuthors.length;

  let authorsToDisplay = normalizedAuthors;
  if (truncate) {
    authorsToDisplay = normalizedAuthors.splice(0, MAX_AUTHORS_IN_CITATIONS);
  }

  // because we have to put `author, author, author & last author name`
  const lastAuthorToDisplay = authorsToDisplay.pop();

  let authorsString = lastAuthorToDisplay.fullname;

  if (0 < authorsToDisplay.length) {
    authorsString = authorsToDisplay
      .map((a) => a.fullname)
      .join(', ')
      .concat(` & ${lastAuthorToDisplay.fullname}`);
  }

  if (truncate) {
    authorsString += ' et al.';
  }

  return replaceLaTeXChars(authorsString);
}

function formatHtmlEntry(type, data) {
  let content;
  switch (type.toLowerCase()) {
    case 'inproceedings':
      content = [
        `${formatAuthors(data.author)} (${data.year}). ${data.title}.`,
        `In <em>${data.booktitle}</em> (pp. ${data.pages}). ${linkify(data.url)}`,
      ].join(' ');
      break;

    case 'article':
      content = [
        `${formatAuthors(data.author)} (${data.year}).`,
        `${data.title}.`,
        `<em>${data.journal}</em>,`,
        `${data.volume}${optional(data.issue, data.number)},`,
        `${data.pages}.`,
        `${linkifyDOI(data.doi)}`,
      ].join(' ');
      break;

    case 'book':
      content = [
        `${formatAuthors(data.author)} (${data.year}).`,
        `<em>${data.title}</em>.`,
        `${data.publisher}`,
      ].join(' ');
      break;

    case 'misc':
    default:
      content = [
        `${formatAuthors(data.author)} (${data.year}).`,
        `${data.title}.`,
        `${data.note || ''}`,
      ].join(' ');

  }

  return replaceLaTeXChars(content);
}

function formatHtmlKey(authors, year) {
  if (0 === authors.length) {
    return `${UNKNOWN_AUTHORS}, ${year}`;
  }

  if (MAX_AUTHORS_IN_REFS >= authors.length) {
    return `${authors.map((a) => a.lastname).join(' & ')}, ${year}`;
  }

  return `${authors[0].lastname} <em>et al.</em>, ${year}`;
}

function formatHtmlReferences(citations) {
  return `(${citations.map((c) => c.htmlKey).join('; ')})`;
}

function formatHtmlCitations(citations) {
  return citations
    .map(c => `<p class="citation">${c.html}</p>`)
    .join('\n')
    .concat('\n')
  ;
}

function formatHtmlInvalidReferences(references) {
  return [
    '<span title="Invalid reference(s)" class="invalid-ref">',
    references,
    '</span>',
  ].join('');
}

// parsing

function parse(bibtex) {
  let entries = [];

  try {
    entries = parser.toJSON(bibtex);
  } catch (e) {
    // parsing has failed, skipping
  }

  const keys = [];
  const results = [];
  for (let i = 0; i < entries.length; i++) {
    const e = entries[i];
    const key = e.citationKey;

    const authors = normalizeAuthors(e.entryTags.author);
    const year = parseInt(e.entryTags.year, 10);

    if (undefined === keys.find((k) => key === k)) {
      keys.push(key);

      results.push({
        key,
        year,
        authors,
        html: formatHtmlEntry(e.entryType, e.entryTags),
        htmlKey: formatHtmlKey(authors, year),
      });
    }
  }

  return results.sort(sortCitations);
}

const bibtex = {
  // returns a set of citations
  parse,
  // returns a set of normalized authors
  normalizeAuthors,
  // HTML renderer
  html: {
    // returns well-formatted references given a set of citations
    renderReferences: formatHtmlReferences,
    // returns HTML for to highlight an invalid reference (given as a string)
    renderInvalidReferences: formatHtmlInvalidReferences,
    // returns well-formatted citations
    renderCitations: formatHtmlCitations,
  },
};

export default bibtex;
