import Base from 'client/models/-base';
import attr from 'ember-data/attr';
import { belongsTo } from 'ember-data/relationships';
import { get, computed } from '@ember/object';

export default Base.extend({
  createdAt: attr('utc'),
  naughtyId: attr('number'),
  naughtyType: attr('string'),
  reason: attr('string'),
  status: attr('string'),
  explanation: attr('string'),

  naughty: belongsTo('-base'),
  moderator: belongsTo('user'),
  user: belongsTo('user'),

  naughtyLink: computed('naughtyType', function() {
    return get(this, 'naughtyType').pluralize().toLowerCase();
  }).readOnly()
});
