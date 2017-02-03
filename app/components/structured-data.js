import Component from 'ember-component';
import computed from 'ember-computed';
import get from 'ember-metal/get';

export default Component.extend({
  tagName: 'script',
  attributeBindings: ['type'],
  type: 'application/ld+json',

  structuredData: computed('data', function() {
    const data = get(this, 'data');
    return JSON.stringify(data);
  }).readOnly()
});
