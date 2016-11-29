import Base from 'client/models/base';
import attr from 'ember-data/attr';
import { hasMany } from 'ember-data/relationships';
import Copyable from 'ember-cli-copyable';

export default Base.extend(Copyable, {
  group: attr('string'),
  isRead: attr('boolean', { defaultValue: true }),
  isSeen: attr('boolean', { defaultValue: true }),

  activities: hasMany('activity')
});
