import Component from 'ember-component';
import get from 'ember-metal/get';
import computed from 'ember-computed';
import service from 'ember-service/inject';
import { isPresent } from 'ember-utils';
import { invokeAction } from 'ember-invoke-action';

export default Component.extend({
  session: service(),

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

  target: computed('activity', {
    get() {
      const activity = get(this, 'activity');
      const [modelType, modelId] = get(activity, 'foreignId').split(':');
      switch (modelType) {
        case 'Post': {
          if (isPresent(modelId)) {
            return { route: 'posts', model: modelId };
          }
          break;
        }
        case 'Follow': {
          const actor = get(activity, 'actor');
          if (isPresent(actor)) {
            return { route: 'users', model: actor };
          }
          break;
        }
        case 'Comment': {
          if (isPresent(modelId)) {
            return { route: 'comments', model: modelId };
          }
          break;
        }
        case 'PostLike':
        case 'CommentLike': {
          if (isPresent(get(activity, 'target.content'))) {
            const id = get(activity, 'target.id');
            if (modelType === 'CommentLike') {
              return { route: 'comments', model: id };
            }
            return { route: 'posts', model: id };
          }
          break;
        }
        default: {
          return null;
        }
      }
    }
  }),

  actions: {
    followNotification() {
      invokeAction(this, 'followNotification', get(this, 'group'), get(this, 'target'));
    }
  }
});
