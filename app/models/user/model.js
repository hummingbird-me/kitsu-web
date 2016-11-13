import Model from 'ember-data/model';
import attr from 'ember-data/attr';
import { belongsTo, hasMany } from 'ember-data/relationships';
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
  commentsCount: attr('number'),
  coverImage: attr('object', { defaultValue: '/images/default_cover.png' }),
  createdAt: attr('date'),
  email: attr('string'),
  facebookId: attr('string'),
  favoritesCount: attr('number'),
  followersCount: attr('number'),
  followingCount: attr('number'),
  gender: attr('string'),
  likesGivenCount: attr('number'),
  location: attr('string'),
  onboarded: attr('boolean'),
  password: attr('string'),
  pastNames: attr('array'),
  postsCount: attr('number'),
  name: attr('string'),
  ratingsCount: attr('number'),
  toFollow: attr('boolean'),
  waifuOrHusbando: attr('string'),
  website: attr('string'),
  updatedAt: attr('date'),

  waifu: belongsTo('character'),

  blocks: hasMany('block', { inverse: 'user' }),
  followers: hasMany('follow', { inverse: 'followed' }),
  following: hasMany('follow', { inverse: 'follower' })
});
