import React from 'react';
import { mount, shallow, render } from 'enzyme';
import { expect } from 'chai';
import emojione from 'emojione';
import hljs from 'highlight.js';
import mdit from 'markdown-it';
import katex from 'katex';
import sinon from 'sinon';

// plugins loaded in the PreviewLoader, which we cannot use in the test suite
// since it is tied to webpack's require feature...
import mditFontAwesome from 'markdown-it-fontawesome';
import mditModifyToken from 'markdown-it-modify-token';
import mditSup from 'markdown-it-sup';
import mditSub from 'markdown-it-sub';
import mditMark from 'markdown-it-mark';
import mditIns from 'markdown-it-ins';
import mditAbbr from 'markdown-it-abbr';
import mditKatex from 'markdown-it-katex';
import mditContainer from 'markdown-it-container';
import mditClassy from 'markdown-it-classy';
import mditTaskLists from 'markdown-it-task-lists';

// see: https://github.com/mochajs/mocha/issues/1847
const { before, describe, it, Promise } = global;

import Preview from '../presenter';


describe('<Preview />', () => {

  let previewLoader;

  before(() => {
    previewLoader = () => {

      return Promise.resolve({
        markdownIt: mdit,
        markdownItPlugins: [
          mditFontAwesome,
          mditModifyToken,
          mditSup,
          mditMark,
          mditSub,
          mditIns,
          mditAbbr,
          mditKatex,
          mditClassy,
        ],
        markdownItContainer: mditContainer,
        markdownItTaskLists: mditTaskLists,
        hljs: hljs,
        emojione: emojione
      });
    };
  });

  it('renders a block with preview css class', () => {
    const wrapper = shallow(
      <Preview
        content={""}
        position={0}
        template={''}
        onClickCheckbox={() => {}}
      />
    );

    expect(wrapper.find('.preview')).to.have.length(1);
  });

  it('renders a loading message', () => {
    const wrapper = render(
      <Preview
        content={""}
        position={0}
        template={''}
        onClickCheckbox={() => {}}
      />);

    expect(wrapper.text()).to.contain('Loading all the rendering stuff...');
  });

  it('renders content', (done) => {
    const wrapper = mount(
      <Preview
        content={'foo'}
        position={0}
        previewLoader={previewLoader}
        template={''}
        onClickCheckbox={() => {}}
      />
    );

    setTimeout(() => {
      expect(wrapper.html()).to.contain('foo');

      done();
    });
  });

  it('converts markdown into HTML', (done) => {
    const wrapper = mount(
      <Preview
        content={'*italic*'}
        position={0}
        previewLoader={previewLoader}
        template={''}
        onClickCheckbox={() => {}}
      />
    );

    setTimeout(() => {
      expect(wrapper.html()).to.contain('<em>italic</em>');

      done();
    });
  });

  it('converts markdown blocks into HTML chunks', (done) => {
    const wrapper = mount(
      <Preview
        content={['*italic*', '**bold**'].join('\n\n')}
        position={0}
        previewLoader={previewLoader}
        template={''}
        onClickCheckbox={() => {}}
      />
    );

    setTimeout(() => {
      expect(wrapper.html()).to.contain(
        '<div class="chunk"><span><p><em>italic</em></p>\n</span></div>'
      );

      expect(wrapper.html()).to.contain(
        '<div class="chunk"><span><p><strong>bold</strong></p>\n</span></div>'
      );

      done();
    });
  });

  it('converts Emoji', (done) => {
    const wrapper = mount(
      <Preview
        content={":smile:"}
        position={0}
        previewLoader={previewLoader}
        template={''}
        onClickCheckbox={() => {}}
      />
    );

    setTimeout(() => {
      expect(wrapper.html()).to.contain(
        '<span class="emojione emojione-1f604" title=":smile:">😄</span>'
      );

      done();
    });
  });

  it('highlights code blocks', (done) => {
    const wrapper = mount(
      <Preview
        content={'```python\nprint()\n```'}
        position={0}
        previewLoader={previewLoader}
        template={''}
        onClickCheckbox={() => {}}
      />
    );

    setTimeout(() => {
      expect(wrapper.html()).to.contain(
        [
          '<pre><code class="language-python">',
          '<span class="hljs-function">',
          '<span class="hljs-title">print</span>',
          '<span class="hljs-params">()</span>',
          '</span>',
          '\n',
          '</code></pre>'
        ].join('')
      );

      done();
    });
  });

  it('generates paragraph chunks', (done) => {
    let chunks;
    const wrapper = shallow(
      <Preview
        content={''}
        position={0}
        previewLoader={previewLoader}
        template={''}
        onClickCheckbox={() => {}}
      />
    );

    setTimeout(() => {
      const preview = wrapper.instance();

      chunks = preview.getChunks('foo', {});
      expect(chunks).to.have.lengthOf(1);
      expect(chunks[0]).to.have.lengthOf(3);

      chunks = preview.getChunks('foo\n\nbar', {});
      expect(chunks).to.have.lengthOf(2);

      expect(chunks[0][0]).to.have.property('type', 'paragraph_open');
      expect(chunks[0][1]).to.have.property('type', 'inline');
      expect(chunks[0][1]).to.have.property('content', 'foo');
      expect(chunks[0][2]).to.have.property('type', 'paragraph_close');

      expect(chunks[1][0]).to.have.property('type', 'paragraph_open');
      expect(chunks[1][1]).to.have.property('type', 'inline');
      expect(chunks[1][1]).to.have.property('content', 'bar');
      expect(chunks[1][2]).to.have.property('type', 'paragraph_close');
      done();
    });
  });

  it('generates code block chunks', (done) => {
    let chunks;
    const wrapper = shallow(
      <Preview
        content={''}
        position={0}
        previewLoader={previewLoader}
        template={''}
        onClickCheckbox={() => {}}
      />
    );

    setTimeout(() => {
      const preview = wrapper.instance();

      // A code block is one single chunk
      chunks = preview.getChunks('```python\nprint()\nfoo()\n```', {});
      expect(chunks).to.have.lengthOf(1);

      // A code block with empty rows is still one single chunk
      chunks = preview.getChunks('```python\nprint()\n\nfoo()\n```', {});
      expect(chunks).to.have.lengthOf(1);

      done();
    });
  });

  it('generates nested block chunks', (done) => {
    let chunks;
    const wrapper = shallow(
      <Preview
        content={''}
        position={0}
        previewLoader={previewLoader}
        template={''}
        onClickCheckbox={() => {}}
      />
    );

    setTimeout(() => {
      const preview = wrapper.instance();

      chunks = preview.getChunks('> this is **bold** content', {});
      expect(chunks).to.have.lengthOf(1);
      expect(chunks[0]).to.have.lengthOf(5);

      chunks = preview.getChunks('* foo\n* bar\n', {});
      expect(chunks).to.have.lengthOf(1);
      expect(chunks[0]).to.have.lengthOf(12);

      done();
    });
  });

  it('removes front-matter YAML header from preview', (done) => {
    const wrapper = mount(
      <Preview
        content={'---\ntoto: 1\n---\n*italic*'}
        position={0}
        previewLoader={previewLoader}
        template={''}
        onClickCheckbox={() => {}}
      />
    );

    setTimeout(() => {
      expect(wrapper.html()).to.contain('<em>italic</em>');

      done();
    });
  });

  it('stores front-matter (YAML) values', (done) => {
    const wrapper = mount(
      <Preview
        content={'---\ntoto: 1\n---\n*italic*'}
        position={0}
        previewLoader={previewLoader}
        template={''}
        onClickCheckbox={() => {}}
      />
    );

    setTimeout(() => {
      const preview = wrapper.instance();
      expect(preview.matter).to.have.property('content', '*italic*');
      expect(preview.matter).to.have.property('data');
      expect(preview.matter.data).to.deep.equal({ toto:1 });

      done();
    });
  });

  it('compiles a template given a context', (done) => {
    const wrapper = mount(
      <Preview
        content={'---\nlocation: Foo\nsignature: John Doe\n---\nThis is content'}
        template={'letter'}
        position={0}
        previewLoader={previewLoader}
        onClickCheckbox={() => {}}
      />
    );

    setTimeout(() => {
      const html = wrapper.html();

      expect(html).to.contain('Foo');
      expect(html).to.contain('<div>John Doe</div>');
      expect(html).to.contain([
        '<div class="chunk">',
        '<span>',
        '<p>',
        'This is content',
        '</p>\n',
        '</span>',
        '</div>'
      ].join(''));

      done();
    });
  });

  it('does not add context without template', (done) => {
    const wrapper = mount(
      <Preview
        content={'---\ntitle: Foo\nauthor: John Doe\n---\nThis is content'}
        template={''}
        position={0}
        previewLoader={previewLoader}
        onClickCheckbox={() => {}}
      />
    );

    setTimeout(() => {
      const html = wrapper.html();

      expect(html).not.to.contain('Foo</h1>');
      expect(html).not.to.contain('John Doe</div>');
      expect(html).to.contain([
        '<div class="chunk">',
        '<span>',
        '<p>',
        'This is content',
        '</p>\n',
        '</span>',
        '</div>'
      ].join(''));

      done();
    });
  });

  it('should not display iframes (#122)', (done) => {
    const content = '<a href=""><iframe src="javascript:alert(1)"></iframe></a>';
    const wrapper = mount(
      <Preview
        content={content}
        position={0}
        previewLoader={previewLoader}
        template={''}
        onClickCheckbox={() => {}}
      />
    );

    setTimeout(() => {
      expect(wrapper.html()).not.to.contain(content);

      done();
    });
  });

  it('should not render bad input tag (#122)', (done) => {
    const content = '<input onfocus=alert(1) autofocus>>';
    const wrapper = mount(
      <Preview
        content={content}
        position={0}
        previewLoader={previewLoader}
        template={''}
        onClickCheckbox={() => {}}
      />
    );

    setTimeout(() => {
      expect(wrapper.html()).not.to.contain('input onfocus="alert(1)" autofocus=""');

      done();
    });
  });

  it('should not render bad HTML tag (#122)', (done) => {
    const content = '<<img onerror=alert(1) src=x/>>';
    const wrapper = mount(
      <Preview
        content={content}
        position={0}
        previewLoader={previewLoader}
        template={''}
        onClickCheckbox={() => {}}
      />
    );

    setTimeout(() => {
      expect(wrapper.html()).not.to.contain('img onerror="alert(1)" src="x/"');

      done();
    });
  });

  it('supports FontAwesome', (done) => {
    const wrapper = mount(
      <Preview
        content={':fa-globe:'}
        position={0}
        previewLoader={previewLoader}
        template={''}
        onClickCheckbox={() => {}}
        onClickCheckbox={() => {}}
      />
    );

    setTimeout(() => {
      expect(wrapper.html()).to.contain('<i class="fa fa-globe"></i>');

      done();
    });
  });

  it('should display links with rel="noopener"', (done) => {
    const wrapper = mount(
      <Preview
        content={'[foo](/url)'}
        position={0}
        previewLoader={previewLoader}
        template={''}
        onClickCheckbox={() => {}}
      />
    );

    setTimeout(() => {
      expect(wrapper.html()).to.contain('<a href="/url" rel="noreferrer noopener">foo</a>');

      done();
    });
  });

  it('supports <sup> tag with ^text^', (done) => {
    const wrapper = mount(
      <Preview
        content={'29^th^'}
        position={0}
        previewLoader={previewLoader}
        template={''}
        onClickCheckbox={() => {}}
      />
    );

    setTimeout(() => {
      expect(wrapper.html()).to.contain('<p>29<sup>th</sup></p>');

      done();
    });
  });

  it('supports <mark> tag with ==text==', (done) => {
    const wrapper = mount(
      <Preview
        content={'==marked=='}
        position={0}
        previewLoader={previewLoader}
        template={''}
        onClickCheckbox={() => {}}
      />
    );

    setTimeout(() => {
      expect(wrapper.html()).to.contain('<p><mark>marked</mark></p>');

      done();
    });
  });

  it('supports strikethrough with ~~text~~', (done) => {
    const wrapper = mount(
      <Preview
        content={'~~Strikethrough~~'}
        position={0}
        previewLoader={previewLoader}
        template={''}
        onClickCheckbox={() => {}}
      />
    );

    setTimeout(() => {
      expect(wrapper.html()).to.contain('<p><s>Strikethrough</s></p>');

      done();
    });
  });

  it('has linkify plugin enabled', (done) => {
    const wrapper = mount(
      <Preview
        content={'http://example.org'}
        position={0}
        previewLoader={previewLoader}
        template={''}
        onClickCheckbox={() => {}}
      />
    );

    setTimeout(() => {
      expect(wrapper.html()).to.contain(
        '<a href="http://example.org" rel="noreferrer noopener">http://example.org</a>'
      );

      done();
    });
  });

  it('supports <sub> tag with ~text~', (done) => {
    const wrapper = mount(
      <Preview
        content={'H~2~O'}
        position={0}
        previewLoader={previewLoader}
        template={''}
        onClickCheckbox={() => {}}
      />
    );

    setTimeout(() => {
      expect(wrapper.html()).to.contain('<p>H<sub>2</sub>O</p>');

      done();
    });
  });

  it('supports insert (<ins>) tag with ++text++', (done) => {
    const wrapper = mount(
      <Preview
        content={'++inserted++'}
        position={0}
        previewLoader={previewLoader}
        template={''}
        onClickCheckbox={() => {}}
      />
    );

    setTimeout(() => {
      expect(wrapper.html()).to.contain('<p><ins>inserted</ins></p>');

      done();
    });
  });

  it('supports <abbr> tags', (done) => {
    const content = [
      '*[HTML]: Hyper Text Markup Language',
      '*[W3C]:  World Wide Web Consortium',
      'The HTML specification is maintained by the W3C.'
    ].join("\n");

    const wrapper = mount(
      <Preview
        content={content}
        position={0}
        previewLoader={previewLoader}
        template={''}
        onClickCheckbox={() => {}}
      />
    );

    setTimeout(() => {
      expect(wrapper.html()).to.contain([
        '<p>The <abbr title="Hyper Text Markup Language">HTML</abbr>',
        'specification is maintained by the <abbr title="World Wide',
        'Web Consortium">W3C</abbr>.</p'
      ].join(' '));

      done();
    });
  });

  it('supports Math expressions', (done) => {
    const wrapper = mount(
      <Preview
        content={'$Sut \leq_{ct} S^N =_{def} CTraces(Sut) \subseteq Traces_{Pass}(R(S^N))$'}
        position={0}
        previewLoader={previewLoader}
        template={''}
        onClickCheckbox={() => {}}
      />
    );

    setTimeout(() => {
      expect(wrapper.html()).to.contain('class="katex"');

      done();
    });
  });

  it('supports custom container: small', (done) => {
    const wrapper = mount(
      <Preview
        content={':::small\nfoo\n:::'}
        position={0}
        previewLoader={previewLoader}
        template={''}
        onClickCheckbox={() => {}}
      />
    );

    setTimeout(() => {
      expect(wrapper.html()).to.contain('<small>\n<p>foo</p>\n</small>');

      done();
    });
  });

  it('supports CSS custom classes', (done) => {
    const wrapper = mount(
      <Preview
        content={'hello\n{css-class}'}
        position={0}
        previewLoader={previewLoader}
        template={''}
        onClickCheckbox={() => {}}
      />
    );

    setTimeout(() => {
      expect(wrapper.html()).to.contain('<p class="css-class">hello</p>');

      done();
    });
  });

  // cf. https://github.com/andrey-p/markdown-it-classy/issues/8
  it('does not break tables because of classy plugin', (done) => {
    const content = `
Annonce | Où | WM | Taille | Nb pièces | Etage | Balcon? | Cave/Gge/Parking | Ascenceur? | Cuisine | Libre
--- | --- | --- | --- | --- | --- | --- | --- | --- | --- | ---
[Lien](http://schnapp.de/miete/wohnungen/ruh-idyll-geleg-2-zi-wohnung-x1x) | [Landwasser](https://goo.gl/maps/7hmfddKPsw12) | 740 KM + NK | 64m2 |  | 3e | 2 | Garage | Equipée | Oui| 01.09.2016
[Lien](http://schnapp.de/miete/wohnungen/fr-opfingen-2-zi-dg-studio) | Opfingen? | 420 + 140 | 68m2 |  |  | Non | Cave/Parking |  | Equipée | 1.11.16 evtl. 1.10.16`;

    const wrapper = mount(
      <Preview
        content={content}
        position={0}
        previewLoader={previewLoader}
        template={''}
        onClickCheckbox={() => {}}
      />
    );

    setTimeout(() => {
      expect(wrapper.html()).to.contain(`Annonce`);
      expect(wrapper.html()).to.contain(`schnapp.de`);

      done();
    });
  });

  it('supports task lists', (done) => {
    const wrapper = mount(
      <Preview
        content={'Hello:\n\n- [ ] item'}
        position={0}
        previewLoader={previewLoader}
        template={''}
        onClickCheckbox={() => {}}
      />
    );

    setTimeout(() => {
      expect(wrapper.html()).to.contain('<li class="task-list-item">');

      done();
    });
  });

  it('should add a data attribute to each task list item', (done) => {
    const wrapper = mount(
      <Preview
        content={'Hello:\n\n- [ ] item'}
        position={0}
        previewLoader={previewLoader}
        template={''}
        onClickCheckbox={() => {}}
      />
    );

    setTimeout(() => {
      expect(wrapper.html()).to.contain('data-task-list-item-index="0"');

      done();
    });
  });
});
