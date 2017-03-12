import Base from 'client/models/-base';
import attr from 'ember-data/attr';

export default Base.extend({
  description: attr('string'),
  name: attr('string'),
  slug: attr('string')
});
