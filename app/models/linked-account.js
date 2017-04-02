import Base from 'client/models/-base';
import attr from 'ember-data/attr';
import { belongsTo } from 'ember-data/relationships';

export default Base.extend({
  externalUserId: attr('string'),
  kind: attr('string'),
  shareFrom: attr('boolean', { defaultValue: false }),
  shareTo: attr('boolean', { defaultValue: false }),
  syncTo: attr('boolean', { defaultValue: false }),
  token: attr('object'),

  user: belongsTo('user')
});
