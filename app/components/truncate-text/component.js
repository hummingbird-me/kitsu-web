import Component from 'ember-component';
import computed from 'ember-computed';
import get from 'ember-metal/get';

const TruncateTextComponent = Component.extend({
  isExpanded: false,
  max: 200,

  isTruncated: computed('text', {
    get() {
      return get(this, 'text.length') > get(this, 'max');
    }
  }).readOnly()
});

TruncateTextComponent.reopenClass({
  positionalParams: ['text']
});

export default TruncateTextComponent;
