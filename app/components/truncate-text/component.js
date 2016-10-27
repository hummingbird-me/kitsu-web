import Component from 'ember-component';

const TruncateTextComponent = Component.extend({
  isExpanded: false,
  max: 200
});

TruncateTextComponent.reopenClass({
  positionalParams: ['text']
});

export default TruncateTextComponent;
