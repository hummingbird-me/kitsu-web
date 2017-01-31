import Base from 'client/models/-base';
import attr from 'ember-data/attr';
import { belongsTo } from 'ember-data/relationships';

export default Base.extend({
  createdAt: attr('date'),
  errorMessage: attr('string'),
  errorTrace: attr('string'),
  inputFile: attr('object'),
  inputText: attr('string'),
  kind: attr('string'),
  progress: attr('number'),
  status: attr('string'),
  strategy: attr('string'),
  total: attr('number'),

  user: belongsTo('user')
});
