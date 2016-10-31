import Component from 'ember-component';
import get from 'ember-metal/get';
import getter from 'client/utils/getter';
import moment from 'moment';

export default Component.extend({
  classNames: ['stream-item', 'row'],
  isSynopsisExpanded: false,

  media: getter(function() {
    return get(this, 'group.activities.firstObject.media');
  }),

  groupByTime: getter(function() {
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
          date: moment(time).format('MM.DD.YY'),
          activities: []
        };
      }
      temp[key].activities.push(activity);
    });
    return Object.values(temp);
  })
});
