import Component from 'ember-component';
import get from 'ember-metal/get';
import getter from 'client/utils/getter';

export default Component.extend({
  classNameBindings: ['loadingSize'],
  classNames: ['loading'],
  tagName: 'span',
  size: 'small',

  loadingSize: getter(function() { return `loading--${get(this, 'size')}`; })
});
