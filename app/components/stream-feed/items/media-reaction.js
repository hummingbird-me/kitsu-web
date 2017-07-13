import Component from 'client/components/media/media-reaction';
import get from 'ember-metal/get';
import set from 'ember-metal/set';
import service from 'ember-service/inject';
import { alias, reads } from 'ember-computed';

export default Component.extend({
  classNames: ['stream-item', 'row'],
  metrics: service(),
  activity: reads('group.activities.firstObject'),
  media: alias('reaction.media'),

  didReceiveAttrs() {
    set(this, 'reaction', get(this, 'activity.subject.content') || get(this, 'activity.subject'));
    this._super(...arguments);
  },

  actions: {
    trackEngagement(label) {
      const data = {
        label,
        content: { foreign_id: `MediaReaction:${get(this, 'reaction.id')}` },
        position: get(this, 'positionInFeed') || 0
      };
      if (get(this, 'feedId') !== undefined) {
        data.feed_id = get(this, 'feedId');
      }
      get(this, 'metrics').invoke('trackEngagement', 'Stream', data);
    },
  }
});
