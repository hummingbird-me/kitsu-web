import attr from 'ember-data/attr';
import { belongsTo, hasMany } from 'ember-data/relationships';
import Base from 'client/models/-base';

export default Base.extend({
  title: attr('string'),
  slug: attr('string'),
  description: attr('string'),
  // image:

  parent: belongsTo('category', { inverse: null }),

  anime: hasMany('anime'),
  manga: hasMany('manga'),
});
