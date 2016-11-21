import Base from 'client/models/base';
import attr from 'ember-data/attr';
import { belongsTo } from 'ember-data/relationships';

export default Base.extend({
  externalUserId: attr('string'),
  url: attr('string'),

  linkedSite: belongsTo('linked-site'),
  user: belongsTo('user', { inverse: 'linkedProfiles' })
});
