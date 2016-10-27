import Component from 'ember-component';
import service from 'ember-service/inject';
import get from 'ember-metal/get';
import set from 'ember-metal/set';
import { invokeAction } from 'ember-invoke-action';
import { bind } from 'ember-runloop';
import jQuery from 'jquery';

export default Component.extend({
  classNameBindings: ['isExpanded:is-expanded'],
  classNames: ['stream-add-content'],
  content: undefined,
  isExpanded: false,
  session: service(),

  /**
   * If the user clicks outside the bounds of this component
   * then set `isExpanded` to false.
   */
  _handleClick(event) {
    const target = get(event, 'target');
    const isChild = jQuery(target).is('.stream-add-content *, .stream-add-content');
    if (isChild === false && (get(this, 'isDestroyed') === false)) {
      set(this, 'isExpanded', false);
    }
  },

  didInsertElement() {
    this._super(...arguments);
    const binding = bind(this, '_handleClick');
    set(this, 'clickBinding', binding);
    jQuery(document.body).on('click', binding);
  },

  willDestroyElement() {
    this._super(...arguments);
    jQuery(document.body).off('click', get(this, 'clickBinding'));
  },

  actions: {
    create() {
      invokeAction(this, 'onCreate', get(this, 'content'));
      set(this, 'content', '');
      set(this, 'isExpanded', false);
    }
  }
});
