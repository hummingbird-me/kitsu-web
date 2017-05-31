import attr from 'ember-data/attr';
import { belongsTo, hasMany } from 'ember-data/relationships';
import Base from 'client/models/-base';

export default Base.extend({
  childCount: attr('number'),
  description: attr('string'),
  image: attr('object'),
  slug: attr('string'),
  title: attr('string'),

  parent: belongsTo('category', { inverse: null }),

  anime: hasMany('anime'),
  manga: hasMany('manga'),
});
