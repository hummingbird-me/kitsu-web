import Component from 'ember-component';
import get from 'ember-metal/get';
import service from 'ember-service/inject';
import { strictInvokeAction } from 'ember-invoke-action';
import getter from 'client/utils/getter';

export default Component.extend({
  classNames: ['stream-item', 'row'],
  metrics: service(),

  activity: getter(function() {
    return get(this, 'group.activities.firstObject');
  }),

  follow: getter(function() {
    return get(this, 'activity.subject');
  }),

  actions: {
    trackEngagement(label) {
      const data = {
        label,
        content: { foreign_id: `Follow:${get(this, 'follow.id')}` },
        position: get(this, 'positionInFeed') || 0
      };
      if (get(this, 'feedId') !== undefined) {
        data.feed_id = get(this, 'feedId');
      }
      get(this, 'metrics').invoke('trackEngagement', 'Stream', data);
    },

    deleteActivity() {
      strictInvokeAction(this, 'deleteActivity', 'user_aggr', get(this, 'activity'), () => {
        strictInvokeAction(this, 'removeGroup', get(this, 'group'));
      });
    }
  }
});
