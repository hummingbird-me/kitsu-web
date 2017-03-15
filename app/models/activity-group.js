import Base from 'client/models/-base';
import attr from 'ember-data/attr';
import { hasMany } from 'ember-data/relationships';

export default Base.extend({
  group: attr('string'),
  isRead: attr('boolean', { defaultValue: true }),
  isSeen: attr('boolean', { defaultValue: true }),

  activities: hasMany('activity', { inverse: null })
});
