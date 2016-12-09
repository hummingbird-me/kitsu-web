import Base from 'client/models/base';
import attr from 'ember-data/attr';
import { belongsTo } from 'ember-data/relationships';
import { validator, buildValidations } from 'ember-cp-validations';

const Validations = buildValidations({
  progress: [
    validator('presence', true),
    validator('number', {
      integer: true,
      gte: 0
    })
  ],
  reconsumeCount: [
    validator('presence', true),
    validator('number', {
      integer: true,
      gte: 0
    })
  ]
});

export default Base.extend(Validations, {
  progress: attr('number'),
  notes: attr('string'),
  private: attr('boolean'),
  rating: attr('number'),
  reconsumeCount: attr('number'),
  status: attr('string'),
  updatedAt: attr('utc'),

  media: belongsTo('media'),
  review: belongsTo('review'),
  unit: belongsTo('base'),
  nextUnit: belongsTo('base'),
  user: belongsTo('user')
});
