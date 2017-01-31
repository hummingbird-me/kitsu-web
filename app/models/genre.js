import attr from 'ember-data/attr';
import Base from 'client/models/-base';

export default Base.extend({
  name: attr('string'),
  slug: attr('string'),
  description: attr('string')
});
