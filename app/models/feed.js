import Base from 'client/models/-base';
import { hasMany } from 'ember-data/relationships';

export default Base.extend({
  activityGroups: hasMany('activity-group')
});
