import Model from 'ember-data/model';
import attr from 'ember-data/attr';
import { hasMany } from 'ember-data/relationships';

export default Model.extend({
  group: attr('string'),
  isRead: attr('boolean', { defaultValue: false }),
  isSeen: attr('boolean', { defaultValue: false }),

  activities: hasMany('activity')
});
