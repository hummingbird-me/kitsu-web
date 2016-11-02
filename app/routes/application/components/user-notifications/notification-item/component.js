import Component from 'ember-component';
import get from 'ember-metal/get';
import getter from 'client/utils/getter';
import { hrefTo } from 'ember-href-to/helpers/href-to';

export default Component.extend({
  activity: getter(function() {
    return get(this, 'group.activities.firstObject');
  }),

  otherCount: getter(function() {
    return get(this, 'group.activities.length') - 1;
  }),

  link: getter(function() {
    const activity = get(this, 'activity');
    const [modelType, modelId] = get(activity, 'foreignId').split(':');
    if (modelType === 'Post') {
      return hrefTo(this, 'posts', modelId);
    } else if (modelType === 'Follow') {
      return hrefTo(this, 'users', get(activity, 'actor.name'));
    }
  })
});
