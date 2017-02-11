import Component from 'ember-component';
import get from 'ember-metal/get';
import computed from 'ember-computed';
import { isPresent } from 'ember-utils';
import { hrefTo } from 'ember-href-to/helpers/href-to';

export default Component.extend({
  activity: computed('group.activities.[]', function() {
    return get(this, 'group.activities.firstObject');
  }).readOnly(),

  others: computed('group.activities.[]', function() {
    return get(this, 'group.activities').toArray().slice(1).reject(a => (
      get(a, 'actor.id') === get(this, 'activity.actor.id')
    ));
  }).readOnly(),

  otherCount: computed('others', function() {
    return get(this, 'others.length');
  }).readOnly(),

  link: computed('activity', function() {
    const activity = get(this, 'activity');
    const streamId = get(this, 'group.streamId');
    const queryParams = { isQueryParams: true, values: { notification: streamId } };
    const [modelType, modelId] = get(activity, 'foreignId').split(':');
    switch (modelType) {
      case 'Post': {
        if (isPresent(modelId)) {
          return hrefTo(this, 'posts', modelId, queryParams);
        }
        break;
      }
      case 'Follow': {
        const actor = get(activity, 'actor');
        if (isPresent(actor)) {
          return hrefTo(this, 'users', actor, queryParams);
        }
        break;
      }
      case 'Comment': {
        if (isPresent(modelId)) {
          return hrefTo(this, 'comments', modelId, queryParams);
        }
        break;
      }
      case 'PostLike':
      case 'CommentLike': {
        if (isPresent(get(activity, 'target.content'))) {
          const id = get(activity, 'target.id');
          if (modelType === 'CommentLike') {
            return hrefTo(this, 'comments', id, queryParams);
          }
          return hrefTo(this, 'posts', id, queryParams);
        }
        break;
      }
      default: {
        return '#';
      }
    }
  }).readOnly()
});
