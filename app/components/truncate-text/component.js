import Component from 'ember-component';
import computed from 'ember-computed';
import get from 'ember-metal/get';
import jQuery from 'jquery';

const TruncateTextComponent = Component.extend({
  isExpanded: false,
  max: 200,

  truncatedText: computed('text', 'max', {
    get() {
      const text = jQuery.truncate(get(this, 'text'), {
        length: get(this, 'max'),
        words: true,
        keepFirstWord: true
      });
      return text.htmlSafe();
    }
  }).readOnly(),

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
