import Base from 'client/models/-base';
import attr from 'ember-data/attr';
import { belongsTo, hasMany } from 'ember-data/relationships';
import { equal } from '@ember/object/computed';
import { validator, buildValidations } from 'ember-cp-validations';

export const Validations = buildValidations({
  name: [
    validator('presence', true),
    validator('length', { min: 3, max: 50 })
  ],
  privacy: [
    validator('presence', true),
    validator('inclusion', { in: ['open', 'closed', 'restricted'] })
  ],
  tagline: [
    validator('presence', true),
    validator('length', { max: 60 })
  ],
  category: [
    validator('presence', true)
  ]
});

export default Base.extend(Validations, {
  about: attr('string'),
  avatar: attr('object', { defaultValue: '/images/default_avatar.png' }),
  coverImage: attr('object', { defaultValue: '/images/default_cover.png' }),
  leadersCount: attr('number'),
  locale: attr('string'),
  membersCount: attr('number'),
  name: attr('string'),
  neighborsCount: attr('number'),
  nsfw: attr('boolean'),
  privacy: attr('string', { defaultValue: 'open' }),
  rules: attr('string'),
  rulesFormatted: attr('string'),
  slug: attr('string'),
  tagline: attr('string'),

  category: belongsTo('group-category'),
  categoryHack: attr('boolean'),

  actionLogs: hasMany('group-action-log', { inverse: 'group' }),
  invites: hasMany('group-invite', { inverse: 'group' }),
  members: hasMany('group-member', { inverse: 'group' }),
  neighbors: hasMany('group-neighbor', { inverse: 'source' }),
  reports: hasMany('group-report', { inverse: 'group' }),
  tickets: hasMany('group-ticket', { inverse: 'group' }),

  isOpen: equal('privacy', 'isOpen'),
  isClosed: equal('privacy', 'closed'),
  isRestricted: equal('privacy', 'restricted')
});
