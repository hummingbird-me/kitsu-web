import Component from 'ember-component';
import get from 'ember-metal/get';
import computed from 'ember-computed';

export default Component.extend({
  tagName: 'span',
  classNames: ['hidden-xs-up'],
  attributeBindings: ['itemscope', 'itemtype'],
  itemscope: '',
  itemtype: computed('type', function() {
    const type = get(this, 'type');
    return `http://schema.org/${type}`;
  }).readOnly()
});
