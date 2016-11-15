import Model from 'ember-data/model';
import attr from 'ember-data/attr';
import { belongsTo } from 'ember-data/relationships';

export default Model.extend({
  externalUserId: attr('string'),
  url: attr('string'),

  linkedSite: belongsTo('linked-site'),
  user: belongsTo('user', { inverse: 'linkedProfiles' })
});
