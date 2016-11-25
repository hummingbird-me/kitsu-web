import Base from 'client/models/base';
import attr from 'ember-data/attr';
import { belongsTo } from 'ember-data/relationships';

export default Base.extend({
  errorMessage: attr('string'),
  errorTrace: attr('string'),
  inputFile: attr('object'),
  inputText: attr('string'),
  kind: attr('string'),
  progress: attr('number'),
  status: attr('number'),
  strategy: attr('number'),
  total: attr('number'),

  user: belongsTo('user')
});
