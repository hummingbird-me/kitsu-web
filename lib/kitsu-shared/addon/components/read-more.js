import Component from '@ember/component';
import { get, set } from '@ember/object';
import layout from 'kitsu-shared/templates/components/read-more';

const ReadMoreComponent = Component.extend({
  layout,
  isTruncated: false,
  wasTruncated: false,
  expandText: 'read more',
  collapseText: 'read less',

  didReceiveAttrs() {
    const text = get(this, 'text');
    const length = get(this, 'length');
    if (text && text.length > length) {
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
