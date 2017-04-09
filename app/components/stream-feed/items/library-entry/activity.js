import Component from 'ember-component';
import get from 'ember-metal/get';
import set from 'ember-metal/set';
import computed from 'ember-computed';
import { strictInvokeAction } from 'ember-invoke-action';

export default Component.extend({
  rating: computed('activity.{rating,nineteenScale}', function() {
    const rating = get(this, 'activity.rating');
    if (get(this, 'activity.nineteenScale')) {
      return rating;
    }
    return rating * 4;
  }).readOnly(),

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
