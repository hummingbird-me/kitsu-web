import Base from 'client/models/-base';
import attr from 'ember-data/attr';
import { belongsTo, hasMany } from 'ember-data/relationships';
import get from 'ember-metal/get';
import computed from 'ember-computed';
import groupBy from 'ember-group-by';

export default Base.extend({
  externalUserId: attr('string'),
  token: attr('string'),
  kind: attr('string'),

  shareFrom: attr('boolean'),
  shareTo: attr('boolean'),
  syncTo: attr('boolean'),

  user: belongsTo('user'),
  libraryEntryLogs: hasMany('libraryEntryLog'),
  sortedLogs: computed('libraryEntryLogs', function() {
    return get(this, 'libraryEntryLogs').sortBy('createdAt').toArray();
  }).readOnly(),
  logsByDate: groupBy('sortedLogs', 'date'),
});
