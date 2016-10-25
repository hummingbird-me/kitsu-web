import Component from 'ember-component';
import service from 'ember-service/inject';
import get from 'ember-metal/get';
import set from 'ember-metal/set';
import { invokeAction } from 'ember-invoke-action';
import jQuery from 'jquery';

export default Component.extend({
  classNames: ['stream-add-content'],
  content: undefined,
  isExpanded: false,
  session: service(),

  /**
   * If the user clicks outside the bounds of this component
   * then set `isExpanded` to false.
   */
  click(event) {
    const target = get(event, 'target');
    const isChild = jQuery(target).is('.stream-add-content *, .stream-add-content');
    if (isChild === false) {
      set(this, 'isExpanded', false);
    }
  },

  actions: {
    create() {
      invokeAction(this, 'onCreate', get(this, 'content'));
      set(this, 'content', '');
    }
  }
});
