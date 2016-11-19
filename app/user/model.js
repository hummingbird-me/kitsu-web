import Model from 'ember-data/model';
import attr from 'ember-data/attr';
import { belongsTo, hasMany } from 'ember-data/relationships';
import { validator, buildValidations } from 'ember-cp-validations';
import service from 'ember-service/inject';
import get from 'ember-metal/get';
import { classify } from 'ember-string';
import { modelType } from 'client/helpers/model-type';

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
  birthday: attr('utc'),
  commentsCount: attr('number'),
  coverImage: attr('object', { defaultValue: '/images/default_cover.png' }),
  createdAt: attr('utc'),
  email: attr('string'),
  facebookId: attr('string'),
  favoritesCount: attr('number'),
  followersCount: attr('number'),
  followingCount: attr('number'),
  gender: attr('string'),
  likesGivenCount: attr('number'),
  location: attr('string'),
  name: attr('string'),
  onboarded: attr('boolean'),
  password: attr('string'),
  pastNames: attr('array'),
  postsCount: attr('number'),
  ratingsCount: attr('number'),
  roles: attr('array'),
  toFollow: attr('boolean'),
  waifuOrHusbando: attr('string'),
  website: attr('string'),
  updatedAt: attr('utc'),

  waifu: belongsTo('character'),

  blocks: hasMany('block', { inverse: 'user' }),
  followers: hasMany('follow', { inverse: 'followed' }),
  following: hasMany('follow', { inverse: 'follower' }),
  userRoles: hasMany('user-role'),

  // HACK: We use this to flag the model as dirty when waifu changes, as ember-data
  // doesn't currently track the dirtiness of a relationship.
  waifuDirtyHack: attr('boolean', { defaultValue: false }),

  hasRole(roleName, resource) {
    const roles = get(this, 'userRoles').map(ur => get(ur, 'role'));
    const role = roles.find(r => get(r, 'name') === roleName);
    if (role === undefined) {
      return false;
    }

    // blanket role
    if (get(role, 'resource.content') === null) {
      return true;
    }

    // specific resource
    if (modelType([get(role, 'resource')]) === modelType([resource])) {
      if (get(role, 'resource.id') === get(resource, 'id')) {
        return true;
      }
    }

    return false;
  }
});
