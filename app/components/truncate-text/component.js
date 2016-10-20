import Component from 'ember-component';
import get from 'ember-metal/get';
import getter from 'client/utils/getter';
import jQuery from 'jquery';

const TruncateTextComponent = Component.extend({
  isExpanded: false,
  max: 200,

  truncated: getter(function() {
    const text = jQuery.trim(get(this, 'text')).substring(0, get(this, 'max'));
    return `${text}...`;
  })
});

TruncateTextComponent.reopenClass({
  positionalParams: ['text']
});

export default TruncateTextComponent;
