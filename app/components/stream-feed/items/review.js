import Component from 'ember-component';
import get from 'ember-metal/get';
import service from 'ember-service/inject';
import computed from 'ember-computed';
import getter from 'client/utils/getter';

export default Component.extend({
  classNames: ['stream-item', 'row'],

  metrics: service(),

  activity: getter(function() {
    return get(this, 'group.activities.firstObject');
  }),

  review: computed('activity.subject', {
    get() {
      return get(this, 'activity.subject');
    }
  }).readOnly(),

  actions: {
    trackEngagement(label) {
      const data = {
        label,
        content: { foreign_id: get(this, 'activity.foreignId') },
        position: get(this, 'positionInFeed') || 0
      };
      if (get(this, 'feedId') !== undefined) {
        data.feed_id = get(this, 'feedId');
      }
      get(this, 'metrics').invoke('trackEngagement', 'Stream', data);
    }
  }
});
