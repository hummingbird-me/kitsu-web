import Base from 'client/models/-base';
import attr from 'ember-data/attr';
import { belongsTo } from 'ember-data/relationships';
import get from 'ember-metal/get';
import computed from 'ember-computed';

export default Base.extend({
  acceptedAt: attr('utc'),
  createdAt: attr('utc'),
  declinedAt: attr('utc'),
  rejectedAt: attr('utc'),

  group: belongsTo('group'),
  sender: belongsTo('user'),
  user: belongsTo('user'),

  hasResponded: computed('acceptedAt', 'declinedAt', function() {
    return !!(get(this, 'acceptedAt') || get(this, 'declinedAt'));
  }).readOnly()
});
