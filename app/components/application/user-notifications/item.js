import Component from 'ember-component';
import get from 'ember-metal/get';
import computed from 'ember-computed';
import { isPresent } from 'ember-utils';
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
        if (isPresent(modelId) === true) {
          return hrefTo(this, 'posts', modelId);
        }
      } else if (modelType === 'Follow') {
        const actor = get(activity, 'actor');
        if (isPresent(actor) === true) {
          return hrefTo(this, 'users', actor);
        }
      } else if (modelType === 'Comment') {
        if (isPresent(get(activity, 'postId')) === true) {
          return hrefTo(this, 'posts', get(activity, 'postId'));
        }
      }
      return '#';
    }
  })
});
