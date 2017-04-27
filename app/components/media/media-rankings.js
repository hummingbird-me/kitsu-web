import Component from 'ember-component';

export default Component.extend({
  tagName: 'section',
  classNames: ['media-rankings', 'clearfix'],
  classNameBindings: ['length']
});
