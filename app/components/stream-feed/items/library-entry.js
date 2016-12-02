import Component from 'ember-component';
import get from 'ember-metal/get';
import set from 'ember-metal/set';
import service from 'ember-service/inject';
import getter from 'client/utils/getter';
import moment from 'moment';

export default Component.extend({
  classNames: ['stream-item', 'row'],
  isSynopsisExpanded: false,
  hasMoreActivities: false,
  showAll: false,
  activityLimit: 3,
  metrics: service(),

  media: getter(function() {
    return get(this, 'group.activities.firstObject.media');
  }),

  groupByTimeLimited: getter(function() {
    const result = get(this, 'groupByTimeAll').slice(0, 1);
    if (result.length > 1) {
      set(this, 'hasMoreActivities', true);
    }
    if (get(result, 'firstObject.activities.length') > get(this, 'activityLimit')) {
      set(this, 'hasMoreActivities', true);
    }
    return result;
  }),

  groupByTimeAll: getter(function() {
    const temp = {};
    get(this, 'group.activities').forEach((activity) => {
      const time = get(activity, 'time');
      const calendar = moment(time).calendar(null, {
        sameDay: '[Today]',
        lastDay: '[Yesterday]',
        lastWeek: 'dddd',
        sameElse: 'dddd',
      });
      const key = `${calendar}-${moment(time).format('DD')}`;
      if (get(temp, key) === undefined) {
        temp[key] = {
          calendar,
          date: moment(time).format('MMM Do'),
          activities: []
        };
      }
      temp[key].activities.push(activity);
    });
    return Object.values(temp);
  }),

  groupByTime: getter(function() {
    return get(this, 'showAll') === true ? get(this, 'groupByTimeAll') : get(this, 'groupByTimeLimited');
  }),

  actions: {
    trackEngagement(label) {
      const data = {
        label,
        content: { foreign_id: get(this, 'group.activities.firstObject.foreignId') },
        position: get(this, 'positionInFeed') || 0
      };
      if (get(this, 'feedId') !== undefined) {
        data.feed_id = get(this, 'feedId');
      }
      get(this, 'metrics').invoke('trackEngagement', 'Stream', data);
    }
  }
});
