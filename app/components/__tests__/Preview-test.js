import React from 'react';
import { shallow, render } from 'enzyme';
import { expect } from 'chai';
import marked from 'marked';
import emojione from 'emojione';
import hljs from 'highlight.js';

// see: https://github.com/mochajs/mocha/issues/1847
const { before, describe, it } = global;

import Preview from '../Preview';


describe('<Preview />', () => {

  before(() => {
    marked.setOptions({
      sanitize: false,
      highlight: function (code) {
        return hljs.highlightAuto(code).value;
      }
    });
  });

  it('renders a block with preview css class', () => {
    const wrapper = shallow(<Preview raw={""} pos={0} />);
    expect(wrapper.find('.preview')).to.have.length(1);
  });

  it('renders a loading message', () => {
    const wrapper = render(<Preview raw={""} pos={0} />);

    expect(wrapper.text()).to.contain('Loading all the rendering stuff...');
  });

  it('renders content', () => {
    const wrapper = shallow(<Preview raw={"foo"} pos={0} />);
    const html = wrapper.instance().getHTML(marked, emojione).__html;

    expect(html).to.contain('foo');
  });

  it('converts markdown into HTML', () => {
    const wrapper = shallow(<Preview raw={"*italic*"} pos={0} />);
    const html = wrapper.instance().getHTML(marked, emojione).__html;

    expect(html).to.contain('<em>italic</em>');
  });

  it('converts Emoji', () => {
    const wrapper = shallow(<Preview raw={":smile:"} pos={0} />);
    const html = wrapper.instance().getHTML(marked, emojione).__html;

    expect(html).to.contain(
      '<img class="emojione" alt="😄" src="//cdn.jsdelivr.net/emojione/assets/png/1f604.png?v=2.1.1"/>'
    );
  });

  it('highlights code blocks', () => {
    const wrapper = shallow(<Preview raw={"```python\nprint()```"} pos={0} />);
    const html = wrapper.instance().getHTML(marked, emojione).__html;

    expect(html).to.contain(
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
  });
});
