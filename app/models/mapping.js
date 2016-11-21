import attr from 'ember-data/attr';
import Base from 'client/models/base';
import { belongsTo } from 'ember-data/relationships';

export default Base.extend({
  externalSite: attr('string'),
  externalId: attr('string'),

  media: belongsTo('media')
});
