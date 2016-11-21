import Base from 'client/models/base';
import attr from 'ember-data/attr';
import { belongsTo } from 'ember-data/relationships';

export default Base.extend({
  favRank: attr('number'),

  user: belongsTo('user'),
  item: belongsTo('base')
});
