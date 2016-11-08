import Model from 'ember-data/model';
import attr from 'ember-data/attr';
import { hasMany } from 'ember-data/relationships';

export default Model.extend({
  canonicalTitle: attr('string'),
  titles: attr('object'),

  installments: hasMany('installment', { inverse: 'franchise' })
});
