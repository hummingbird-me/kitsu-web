import Component from 'ember-component';
import set from 'ember-metal/set';
import { strictInvokeAction } from 'ember-invoke-action';

export default Component.extend({
  actions: {
    deleteActivity(activity) {
      set(this, 'isDeleteing', true);
      strictInvokeAction(this, 'deleteActivity', activity, () => {
        activity.deleteRecord();
        strictInvokeAction(this, 'onDelete', activity);
        set(this, 'isDeleteing', false);
      });
    }
  }
});
