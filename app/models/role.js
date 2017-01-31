import Base from 'client/models/-base';
import attr from 'ember-data/attr';
import { belongsTo } from 'ember-data/relationships';

export default Base.extend({
  name: attr('string'),
  resourceId: attr('number'),
  resourceType: attr('string'),

  resource: belongsTo('-base')
});
