import Component from '@ember/component';
import { get, computed } from '@ember/object';
import { isPresent } from '@ember/utils';
import { hrefTo } from 'ember-href-to/helpers/href-to';

export default Component.extend({
  activity: computed('group.activities.[]', function() {
    return get(this, 'group.activities.firstObject');
  }).readOnly(),

  isUser: computed('activity', function() {
    return get(this, 'activity.actor.modelType') === 'user';
  }).readOnly(),

  others: computed('group.activities.[]', function() {
    return get(this, 'group.activities').toArray().slice(1).reject(a => (
      get(a, 'actor.id') === get(this, 'activity.actor.id')
    ));
  }).readOnly(),

  otherCount: computed('others', function() {
    return get(this, 'others.length');
  }).readOnly(),

  isMentioned: computed('activity.mentionedUsers', function() {
    const userId = parseInt(get(this, 'session.account.id'), 10);
    return get(this, 'activity.mentionedUsers').includes(userId);
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
        return '#';
      }
      case 'Follow': {
        const actor = get(activity, 'actor');
        if (isPresent(actor)) {
          return hrefTo(this, 'users.index', get(actor, 'url'), queryParams);
        }
        return '#';
      }
      case 'Comment': {
        if (isPresent(modelId)) {
          return hrefTo(this, 'comments', modelId, queryParams);
        }
        return '#';
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
        return '#';
      }
      case 'GroupInvite': {
        if (isPresent(modelId)) {
          return hrefTo(this, 'group-invite', modelId, queryParams);
        }
        return '#';
      }
      case 'MediaReactionVote': {
        if (isPresent(get(activity, 'target'))) {
          const id = get(activity, 'target.id');
          return hrefTo(this, 'media-reactions', id, queryParams);
        }
        return '#';
      }
      case 'Episode': // Aired
      case 'Chapter': {
        const actor = get(activity, 'actor');
        const subject = get(activity, 'subject');
        if (isPresent(actor) && isPresent(subject) && get(subject, 'number') > 0) {
          const type = get(actor, 'modelType');
          const unitType = `${modelType.toLowerCase()}s`;
          return hrefTo(this, `${type}.show.${unitType}.show`, get(actor, 'slug'), get(subject, 'number'), queryParams);
        }
        return '#';
      }
      default: {
        return '#';
      }
    }
  }).readOnly()
});
