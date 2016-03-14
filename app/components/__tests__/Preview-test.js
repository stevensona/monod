import React from 'react';
import { mount, shallow, render } from 'enzyme';
import { expect } from 'chai';
import marked from 'marked';
import emojione from 'emojione';
import hljs from 'highlight.js';

// see: https://github.com/mochajs/mocha/issues/1847
const { before, describe, it, Promise } = global;

import Preview from '../Preview';


describe('<Preview />', () => {

  let previewLoader;

  before(() => {
    previewLoader = () => {
      return Promise.resolve({
        marked: marked,
        hljs: hljs,
        emojione: emojione
      })
    };
  });

  it('renders a block with preview css class', () => {
    const wrapper = shallow(<Preview raw={""} pos={0} />);

    expect(wrapper.find('.preview')).to.have.length(1);
  });

  it('renders a loading message', () => {
    const wrapper = render(<Preview raw={""} pos={0} />);

    expect(wrapper.text()).to.contain('Loading all the rendering stuff...');
  });

  it('renders content', (done) => {
    const wrapper = mount(
      <Preview
        raw={"foo"}
        pos={0}
        previewLoader={previewLoader}
      />
    );

    setTimeout(() => {
      expect(wrapper.html()).to.contain('foo');

      done();
    }, 5);
  });

  it('converts markdown into HTML', (done) => {
    const wrapper = mount(
      <Preview
        raw={"*italic*"}
        pos={0}
        previewLoader={previewLoader}
      />
    );

    setTimeout(() => {
      expect(wrapper.html()).to.contain('<em>italic</em>');

      done();
    }, 5);
  });

  it('converts Emoji', (done) => {
    const wrapper = mount(
      <Preview
        raw={":smile:"}
        pos={0}
        previewLoader={previewLoader}
      />
    );

    setTimeout(() => {
      expect(wrapper.html()).to.contain(
        '<img class="emojione" alt="😄" src="//cdn.jsdelivr.net/emojione/assets/png/1f604.png?v=2.1.1">'
      );

      done();
    }, 5);
  });

  it('highlights code blocks', (done) => {
    const wrapper = mount(
      <Preview
        raw={"```python\nprint()```"}
        pos={0}
        previewLoader={previewLoader}
      />
    );

    setTimeout(() => {
      expect(wrapper.html()).to.contain(
        [
          '<pre><code class="lang-python">',
          '<span class="hljs-function">',
          '<span class="hljs-title">print</span>',
          '<span class="hljs-params">()</span>',
          '</span>',
          '\n',
          '</code></pre>'
        ].join('')
      );

      done();
    }, 5);
  });
});
