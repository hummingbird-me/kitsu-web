import Component from 'ember-component';
import get from 'ember-metal/get';
import computed from 'ember-computed';
import { hrefTo } from 'ember-href-to/helpers/href-to';

export default Component.extend({
  activity: computed('group.activities.[]', {
    get() {
      return get(this, 'group.activities.firstObject');
    }
  }),

  otherCount: computed('group.activities.[]', {
    get() {
      return get(this, 'group.activities.length') - 1;
    }
  }),

  link: computed('activity', {
    get() {
      const activity = get(this, 'activity');
      const [modelType, modelId] = get(activity, 'foreignId').split(':');
      if (modelType === 'Post') {
        return hrefTo(this, 'posts', modelId);
      } else if (modelType === 'Follow') {
        const actor = get(activity, 'actor');
        if (actor === undefined) {
          return '#';
        }
        return hrefTo(this, 'users', get(actor, 'name'));
      }
    }
  })
});
