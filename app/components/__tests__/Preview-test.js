import React from 'react';
import { shallow, render } from 'enzyme';
import { expect } from 'chai';

// see: https://github.com/mochajs/mocha/issues/1847
const { describe, it } = global;

import Preview from '../Preview';


describe('<Preview />', () => {

  it('renders a block with preview css class', () => {
    const wrapper = shallow(<Preview raw={""} pos={0} />);
    expect(wrapper.find('.preview')).to.have.length(1);
  });

  it('renders content', () => {
    const wrapper = render(<Preview raw={"foo"} pos={0} />);
    expect(wrapper.find('.rendered').text()).to.contain('foo');
  });

  it('converts markdown into HTML', () => {
    const wrapper = render(<Preview raw={"*italic*"} pos={0} />);
    expect(wrapper.find('.rendered').html()).to.contain('<em>italic</em>');
  });

  it('converts Emoji', () => {
    const wrapper = render(<Preview raw={" :)"} pos={0} />);
    expect(wrapper.find('.rendered').html()).to.contain(
      '<img align="absmiddle" alt=":smile:" class="emoji" src="https://github.global.ssl.fastly.net/images/icons/emoji//smile.png" title=":smile:">'
    );
  });

  it('highlights code blocks', () => {
    const wrapper = render(<Preview raw={"```python\nprint()```"} pos={0} />);
    expect(wrapper.find('.rendered').html()).to.contain(
      '<pre><code class="lang-python"><span class="hljs-function"><span class="hljs-title">print</span><span class="hljs-params">()</span></span>\n</code></pre>'
    );
  });
});
