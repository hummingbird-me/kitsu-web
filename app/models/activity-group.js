import Base from 'client/models/base';
import attr from 'ember-data/attr';
import { hasMany } from 'ember-data/relationships';

export default Base.extend({
  group: attr('string'),
  /**
   * Defaulted to true as these activitty groups share the same ids as ones we receive from
   * feeds, and therefore these values are reset -- causing notifications to be come un-seen/read.
   */
  isRead: attr('boolean', { defaultValue: true }),
  isSeen: attr('boolean', { defaultValue: true }),

  activities: hasMany('activity')
});
