import Component from '@ember/component';
import { get, set, computed } from '@ember/object';
import { htmlSafe, isHTMLSafe } from '@ember/string';
import clip from 'text-clipper';

const ReadMoreComponent = Component.extend({
  isHTML: false,
  maxLines: Infinity,
  isTruncated: false,
  wasTruncated: false,
  expandText: 'read more',
  collapseText: 'read less',

  truncatedText: computed('text', 'length', 'isHTML', 'maxLines', function() {
    const options = { html: this.get('isHTML'), maxLines: this.get('maxLines') };
    const text = this.get('text');
    if (!text) { return null; }

    const string = isHTMLSafe(text) ? text.string : text;
    return htmlSafe(clip(string, this.get('length'), options));
  }).readOnly(),

  didReceiveAttrs() {
    const text = get(this, 'text');
    const textLength = isHTMLSafe(text) ? text.string.length : text.length;
    const truncated = this.get('truncatedText');
    if (truncated && truncated.string.length < textLength) {
      set(this, 'isTruncated', true);
      set(this, 'wasTruncated', true);
    }
  },

  actions: {
    toggleVisibility() {
      this.toggleProperty('isTruncated');
    }
  }
});

ReadMoreComponent.reopenClass({
  positionalParams: ['text', 'length']
});

export default ReadMoreComponent;
