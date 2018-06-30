import Component from '@ember/component';
import { get, set, computed } from '@ember/object';
import { htmlSafe } from '@ember/string';
import layout from 'kitsu-shared/templates/components/read-more';
import clip from 'text-clipper';

const ReadMoreComponent = Component.extend({
  layout,
  isHTML: false,
  maxLines: Infinity,
  isTruncated: false,
  wasTruncated: false,
  expandText: 'read more',
  collapseText: 'read less',

  truncatedText: computed('text', 'length', 'isHTML', 'maxLines', function() {
    const options = { html: this.get('isHTML'), maxLines: this.get('maxLines') };
    let text = this.get('text');
    if (this.get('isHTML')) {
      text = text.string;
    }
    return htmlSafe(clip(text, this.get('length'), options));
  }).readOnly(),

  didReceiveAttrs() {
    const text = get(this, 'text');
    const length = get(this, 'length');
    let textLength = text.length;
    if (this.get('isHTML')) {
      textLength = text.string.length; // HtmlSafe object
    }
    if (text && textLength > length) {
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
