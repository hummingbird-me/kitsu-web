import Model from 'ember-data/model';
import attr from 'ember-data/attr';
import { belongsTo } from 'ember-data/relationships';
import { validator, buildValidations } from 'ember-cp-validations';
import service from 'ember-service/inject';
import get from 'ember-metal/get';

const Validations = buildValidations({
  email: [
    validator('presence', true),
    validator('format', {
      type: 'email',
      regex: /^[^@]+@([^@\.]+\.)+[^@\.]+$/
    })
  ],
  name: [
    validator('presence', true),
    validator('length', { min: 3, max: 20 }),
    validator('format', {
      regex: /^[_a-zA-Z0-9]+$/,
      message() {
        return get(this, 'model.i18n').t('errors.user.name.invalid').toString();
      }
    }),
    validator('format', {
      regex: /(?!^\d+$)^.+$/,
      message() {
        return get(this, 'model.i18n').t('errors.user.name.numbers').toString();
      }
    }),
    validator('format', {
      regex: /^[a-zA-Z0-9]/,
      message() {
        return get(this, 'model.i18n').t('errors.user.name.starts').toString();
      }
    })
  ],
  password: [
    validator('presence', true),
    validator('length', { min: 8 })
  ]
});

export default Model.extend(Validations, {
  i18n: service(),

  about: attr('string'),
  aboutFormatted: attr('string'),
  avatar: attr('object', { defaultValue: '/images/default_avatar.png' }),
  bio: attr('string'),
  birthday: attr('date'),
  coverImage: attr('object', { defaultValue: '/images/default_cover.png' }),
  createdAt: attr('date'),
  email: attr('string'),
  followersCount: attr('number'),
  followingCount: attr('number'),
  gender: attr('string'),
  location: attr('string'),
  onboarded: attr('boolean'),
  password: attr('string'),
  pastNames: attr('array'),
  name: attr('string'),
  toFollow: attr('boolean'),
  waifuOrHusbando: attr('string'),
  website: attr('string'),
  updatedAt: attr('date'),

  waifu: belongsTo('character')
});
