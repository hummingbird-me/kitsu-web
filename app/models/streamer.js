import Base from 'client/models/base';
import attr from 'ember-data/attr';

export default Base.extend({
  siteName: attr('string'),
  logo: attr('string')
});
