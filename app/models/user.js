import Base from 'client/models/-base';
import attr from 'ember-data/attr';
import { belongsTo, hasMany } from 'ember-data/relationships';
import { validator, buildValidations } from 'ember-cp-validations';
import { isEmpty } from 'ember-utils';
import { classify } from 'ember-string';
import computed from 'ember-computed';
import get from 'ember-metal/get';

export const Validations = buildValidations({
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
      messageKey: 'errors.user.name.invalid'
    }),
    validator('format', {
      regex: /(?!^\d+$)^.+$/,
      messageKey: 'errors.user.name.numbers'
    }),
    validator('format', {
      regex: /^[a-zA-Z0-9]/,
      messageKey: 'errors.user.name.starts'
    })
  ],
  password: [
    validator('presence', true),
    validator('length', { min: 8 })
  ]
});

export default Base.extend(Validations, {
  about: attr('string'),
  avatar: attr('object', { defaultValue: '/images/default_avatar.png' }),
  birthday: attr('utc'),
  commentsCount: attr('number'),
  confirmed: attr('boolean', { defaultValue: false }),
  coverImage: attr('object', { defaultValue: '/images/default_cover.png' }),
  country: attr('string'),
  createdAt: attr('utc'),
  email: attr('string'),
  facebookId: attr('string'),
  favoritesCount: attr('number'),
  feedCompleted: attr('boolean'),
  followersCount: attr('number'),
  followingCount: attr('number'),
  gender: attr('string'),
  language: attr('string'),
  likesGivenCount: attr('number'),
  location: attr('string'),
  name: attr('string'),
  password: attr('string'),
  pastNames: attr('array'),
  postsCount: attr('number'),
  proExpiresAt: attr('utc'),
  profileCompleted: attr('boolean'),
  ratingsCount: attr('number'),
  ratingSystem: attr('string'),
  reviewsCount: attr('number'),
  roles: attr('array'),
  sfwFilter: attr('boolean'),
  shareToGlobal: attr('boolean'),
  timeZone: attr('string'),
  title: attr('string'),
  titleLanguagePreference: attr('string', { defaultValue: 'canonical' }),
  waifuOrHusbando: attr('string'),
  website: attr('string'),
  updatedAt: attr('utc'),

  // NOTE: These properties are not used for mapping posts to user
  // without them, ember-data will override its null inverse!
  posts: hasMany('post', { inverse: 'user' }),
  receivedPosts: hasMany('post', { inverse: 'targetUser' }),

  waifu: belongsTo('character'),
  pinnedPost: belongsTo('post', { inverse: null }),

  blocks: hasMany('block', { inverse: 'user' }),
  favorites: hasMany('favorite', { inverse: 'user' }),
  followers: hasMany('follow', { inverse: 'followed' }),
  following: hasMany('follow', { inverse: 'follower' }),
  profileLinks: hasMany('profile-link', { inverse: 'user' }),
  userRoles: hasMany('user-role'),

  // HACK: We use this to flag the model as dirty when waifu changes, as ember-data
  // doesn't currently track the dirtiness of a relationship.
  waifuDirtyHack: attr('boolean', { defaultValue: false }),

  isPro: computed('proExpiresAt', function() {
    const date = get(this, 'proExpiresAt');
    if (isEmpty(date)) {
      return false;
    }
    return !date.isBefore();
  }).readOnly(),

  hasRole(roleName, resource) {
    const roles = get(this, 'userRoles').map(ur => get(ur, 'role'));
    const validRoles = roles.filter((r) => {
      let hasRole = get(r, 'name') === roleName && !get(r, 'hasDirtyAttributes');
      if (hasRole && get(r, 'resourceType') && resource) {
        hasRole = hasRole && get(r, 'resourceType') === classify(get(resource, 'modelType'));
      }
      return hasRole;
    });

    let valid = false;
    validRoles.forEach((role) => {
      // Class based role or record based role
      if (isEmpty(get(role, 'resourceId')) || get(role, 'resourceId') === get(resource, 'id')) {
        valid = true;
      }
    });

    return valid;
  }
});
