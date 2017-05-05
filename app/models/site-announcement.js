import Base from 'client/models/-base';
import attr from 'ember-data/attr';

export default Base.extend({
  description: attr('string'),
  imageUrl: attr('string'),
  link: attr('string'),
  title: attr('string')
});
