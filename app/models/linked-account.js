import Base from 'client/models/-base';
import attr from 'ember-data/attr';
import { belongsTo, hasMany } from 'ember-data/relationships';

export default Base.extend({
  externalUserId: attr('string'),
  token: attr('string'),
  kind: attr('string'),
  shareFrom: attr('boolean'),
  shareTo: attr('boolean'),
  syncTo: attr('boolean'),

  user: belongsTo('user'),
  libraryEntryLogs: hasMany('libraryEntryLog'),
});
