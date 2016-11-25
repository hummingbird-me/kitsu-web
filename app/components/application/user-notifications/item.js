import Component from 'ember-component';
import get from 'ember-metal/get';
import computed from 'ember-computed';
import { hrefTo } from 'ember-href-to/helpers/href-to';

export default Component.extend({
  activity: computed('group.activities.[]', {
    get() {
      return get(this, 'group.activities.firstObject');
    }
  }).readOnly(),

  others: computed('group.activities.[]', {
    get() {
      return get(this, 'group.activities').toArray().slice(1).reject(a => (
        get(a, 'actor.id') === get(this, 'activity.actor.id')
      ));
    }
  }).readOnly(),

  otherCount: computed('others', {
    get() {
      return get(this, 'others.length');
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
        return hrefTo(this, 'users', actor);
      }
      return '#';
    }
  })
});
