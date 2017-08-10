import Base from 'client/models/-base';
import attr from 'ember-data/attr';
import { belongsTo } from 'ember-data/relationships';

export default Base.extend({
  playerId: attr('string'),
  platform: attr('string'),

  user: belongsTo('user')
});
