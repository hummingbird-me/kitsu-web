import Base from 'client/models/-base';
import attr from 'ember-data/attr';
import { belongsTo } from 'ember-data/relationships';

export default Base.extend({
  kind: attr('string'),
  statsData: attr('object'),

  user: belongsTo('user')
});
