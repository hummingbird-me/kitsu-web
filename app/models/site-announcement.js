import Base from 'client/models/-base';
import attr from 'ember-data/attr';
import { belongsTo } from 'ember-data/relationships';
import { validator, buildValidations } from 'ember-cp-validations';

const Validations = buildValidations({
  description: [
    validator('presence', true)
  ],
  imageUrl: [
    validator('format', { type: 'url', allowBlank: true })
  ],
  link: [
    validator('format', { type: 'url', allowBlank: true })
  ],
  title: [
    validator('presence', true)
  ]
});

export default Base.extend(Validations, {
  description: attr('string'),
  imageUrl: attr('string'),
  link: attr('string'),
  title: attr('string'),

  user: belongsTo('user')
});
