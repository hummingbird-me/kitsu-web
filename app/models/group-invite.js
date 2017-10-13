import Base from 'client/models/-base';
import attr from 'ember-data/attr';
import { belongsTo } from 'ember-data/relationships';
import { get, computed } from '@ember/object';

export default Base.extend({
  acceptedAt: attr('utc'),
  createdAt: attr('utc'),
  declinedAt: attr('utc'),
  revokedAt: attr('utc'),

  group: belongsTo('group'),
  sender: belongsTo('user'),
  user: belongsTo('user'),

  hasResponded: computed('acceptedAt', 'revokedAt', 'declinedAt', function() {
    return !!(get(this, 'acceptedAt') || get(this, 'declinedAt') || get(this, 'revokedAt'));
  }).readOnly()
});
