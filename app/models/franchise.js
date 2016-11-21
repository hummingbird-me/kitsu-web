import Base from 'client/models/base';
import attr from 'ember-data/attr';
import { hasMany } from 'ember-data/relationships';

export default Base.extend({
  canonicalTitle: attr('string'),
  titles: attr('object'),

  installments: hasMany('installment', { inverse: 'franchise' })
});
