import Base from 'client/models/-base';
import attr from 'ember-data/attr';
import { belongsTo, hasMany } from 'ember-data/relationships';
import { validator, buildValidations } from 'ember-cp-validations';
import { alias, empty, or } from '@ember/object/computed';
import { isEmpty } from '@ember/utils';
import { get, computed } from '@ember/object';

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
    validator('length', { min: 3, max: 20 })
  ],
  slug: {
    disabled: empty('model.slug'),
    validators: [
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
    ]
  },
  password: {
    validators: [
      validator('presence', {
        // Disable if this user already has a password
        disabled: alias('model.hasPassword'),
        presence: true
      }),
      validator('length', {
        // Disable if the password is empty
        disabled: empty('model.password'),
        min: 8
      })
    ]
  }
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
  hasPassword: attr('boolean'),
  language: attr('string'),
  likesGivenCount: attr('number'),
  location: attr('string'),
  mediaReactionsCount: attr('number'),
  name: attr('string'),
  password: attr('string'),
  pastNames: attr('array'),
  postsCount: attr('number'),
  proExpiresAt: attr('utc'),
  profileCompleted: attr('boolean'),
  ratingsCount: attr('number'),
  ratingSystem: attr('string', { defaultValue: 'simple' }),
  reviewsCount: attr('number'),
  roles: attr('array'),
  sfwFilter: attr('boolean'),
  slug: attr('string'),
  shareToGlobal: attr('boolean'),
  status: attr('string', { defaultValue: 'registered' }),
  subscribedToNewsletter: attr('boolean'),
  timeZone: attr('string'),
  title: attr('string'),
  titleLanguagePreference: attr('string', { defaultValue: 'canonical' }),
  theme: attr('string', { defaultValue: 'light' }),
  waifuOrHusbando: attr('string'),
  updatedAt: attr('utc'),

  // NOTE: These properties are not used for mapping posts to user
  // without them, ember-data will override its null inverse!
  posts: hasMany('post', { inverse: 'user' }),
  receivedPosts: hasMany('post', { inverse: 'targetUser' }),
  uploads: hasMany('upload', { inverse: 'user' }),

  waifu: belongsTo('character'),
  pinnedPost: belongsTo('post', { inverse: null }),

  blocks: hasMany('block', { inverse: 'user' }),
  favorites: hasMany('favorite', { inverse: 'user' }),
  followers: hasMany('follow', { inverse: 'followed' }),
  following: hasMany('follow', { inverse: 'follower' }),
  notificationSettings: hasMany('notification-setting', { inverse: 'user' }),
  oneSignalPlayers: hasMany('one-signal-player', { inverse: 'user' }),
  profileLinks: hasMany('profile-link', { inverse: 'user' }),
  stats: hasMany('stat', { inverse: 'user' }),
  userRoles: hasMany('user-role'),

  // HACK: We use this to flag the model as dirty when waifu changes, as ember-data
  // doesn't currently track the dirtiness of a relationship.
  waifuDirtyHack: attr('boolean', { defaultValue: false }),

  url: or('slug', 'id'),

  isPro: computed('proExpiresAt', function() {
    const date = get(this, 'proExpiresAt');
    if (isEmpty(date)) {
      return false;
    }
    return !date.isBefore();
  }).readOnly(),

  isAozoraImported: computed('status', function() {
    return get(this, 'status') === 'aozora';
  }).readOnly(),

  isSimpleRating: computed('ratingSystem', function() {
    return get(this, 'ratingSystem') === 'simple';
  }).readOnly(),

  hasRole(/* roleName, resource */) {
    // Blanket access for staff & mods for the time being.
    const title = (get(this, 'title') || '').toLowerCase();
    return title === 'staff' || title === 'mod';
    // Resource-dependent roles
    /*
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
    */
  }
});
