import Component from 'ember-component';
import get from 'ember-metal/get';
import set from 'ember-metal/set';
import service from 'ember-service/inject';
import computed from 'ember-computed';
import getter from 'client/utils/getter';
import { invokeAction } from 'ember-invoke-action';
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

  groupByTime: getter(function() {
    return get(this, 'showAll') === true ? get(this, 'groupByTimeAll') : get(this, 'groupByTimeLimited');
  }),

  groupByTimeLimited: computed('groupByTimeAll', {
    get() {
      const groups = get(this, 'groupByTimeAll');
      const activityCount = get(this, 'group.activities.length');
      const result = groups.slice(0, 1);
      if (activityCount > get(this, 'activityLimit')) {
        set(this, 'hasMoreActivities', true);
      }
      return result;
    }
  }),

  groupByTimeAll: computed('group.activities.@each.isDeleted', {
    get() {
      const temp = {};
      const activities = get(this, 'group.activities').toArray().sort((a, b) => {
        if (moment(get(a, 'time')).isBefore(get(b, 'time'))) {
          return 1;
        } else if (moment(get(a, 'time')).isAfter(get(b, 'time'))) {
          return -1;
        }
        return 0;
      });
      activities.forEach((activity) => {
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
    }
  }),

  actions: {
    removeGroup() {
      invokeAction(this, 'removeGroup', get(this, 'group'));
    },

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
