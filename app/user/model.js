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
  updatedAt: attr('date'),

  waifu: belongsTo('character'),

  blocks: hasMany('block', { inverse: 'user' }),
  followers: hasMany('follow', { inverse: 'followed' }),
  following: hasMany('follow', { inverse: 'follower' }),

  // HACK: We use this to flag the model as dirty when waifu changes, as ember-data
  // doesn't currently track the dirtiness of a relationship.
  waifuDirtyHack: attr('boolean', { defaultValue: false }),

  hasRole(roleName, resource) {
    const role = get(this, 'roles').find(r => r.name === roleName);
    if (role === undefined) {
      return false;
    }

    // if its a blanket role then return
    if (role.resource_type === null) {
      return true;
    }

    // determine if they have access to the resource
    const resourceId = get(resource, 'id');
    const resourceType = classify(modelType([resource]));
    if (role.resource_type === resourceType) {
      if (role.resource_id === resourceId || role.resource_id === null) {
        return true;
      }
      return false;
    }
  }
});
