import Component from 'ember-component';
import get from 'ember-metal/get';
import { invokeAction } from 'ember-invoke-action';

export default Component.extend({
  tagName: '',
  ratings: [{
    tag: 'awful',
    value: 1
  }, {
    tag: 'meh',
    value: 4
  }, {
    tag: 'good',
    value: 7
  }, {
    tag: 'amazing',
    value: 10
  }],

  actions: {
    onClick(rating) {
      invokeAction(this, 'onClick', get(rating, 'value'));
    }
  }
});
