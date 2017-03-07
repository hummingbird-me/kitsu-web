import Base from 'client/models/-base';
import attr from 'ember-data/attr';
import { belongsTo, hasMany } from 'ember-data/relationships';
import { equal } from 'ember-computed';
import { validator, buildValidations } from 'ember-cp-validations';

export const Validations = buildValidations({
  name: [
    validator('presence', true),
    validator('length', { min: 4, max: 50 })
  ],
  about: [validator('presence', true)],
  // avatar: [validator('presence', true)],
  // coverImage: [validator('presence', true)],
  privacy: [
    validator('presence', true),
    validator('inclusion', { in: ['open', 'closed', 'restricted'] })
  ],
  rules: [validator('presence', true)],
  tagline: [
    validator('presence', true),
    validator('length', { max: 60 })
  ]
});

export default Base.extend(Validations, {
  about: attr('string'),
  avatar: attr('object'),
  coverImage: attr('object'),
  leadersCount: attr('number'),
  locale: attr('string'),
  membersCount: attr('number'),
  name: attr('string'),
  neighborsCount: attr('number'),
  nsfw: attr('boolean'),
  privacy: attr('string'),
  rules: attr('string'),
  rulesFormatted: attr('string'),
  slug: attr('string'),
  tagLine: attr('string'),

  category: belongsTo('group-category'),

  actionLogs: hasMany('group-action-log'),
  invites: hasMany('group-invite'),
  members: hasMany('group-member'),
  neighbors: hasMany('group-neighbor', { inverse: 'source' }),
  reports: hasMany('group-report'),
  tickets: hasMany('group-ticket'),

  isOpen: equal('privacy', 'isOpen'),
  isClosed: equal('privacy', 'closed'),
  isRestricted: equal('privacy', 'restricted')
});
