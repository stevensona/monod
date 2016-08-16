import { expect } from 'chai';

import { Tags, addOrRemoveTag } from '../extra-keys';

// see: https://github.com/mochajs/mocha/issues/1847
const { describe, it } = global;


describe('Markdown/extra-keys', () => {
  it('should add tags to a selection', () => {
    const result = addOrRemoveTag(Tags.STRONG, 'foo');

    expect(result).to.equal('**foo**');
  });

  it('should remove tags when a selection already has the tags', () => {
    const result = addOrRemoveTag(Tags.STRONG, '**foo**');

    expect(result).to.equal('foo');
  });

  it('should not remove tags that are not the same', () => {
    const result = addOrRemoveTag(Tags.ITALIC, '**foo**');

    expect(result).to.equal('_**foo**_');
  });

  it('should not remove tags that are not the same (2)', () => {
    const result = addOrRemoveTag(Tags.STRONG, '*foo*');

    expect(result).to.equal('***foo***');
  });

  it('should handle multiline strings', () => {
    const content = `**Hello
This should not be strong**`;

    const result = addOrRemoveTag(Tags.STRONG, content);

    expect(result).to.equal('Hello\nThis should not be strong');
  });
});
