import Base from 'client/models/-base';
import attr from 'ember-data/attr';
import { hasMany } from 'ember-data/relationships';
import { equal } from 'ember-computed';
import { validator, buildValidations } from 'ember-cp-validations';

export const Validations = buildValidations({
  name: [
    validator('presence', true),
    validator('length', { min: 4, max: 255 })
  ],
  about: [validator('presence', true)],
  // avatar: [validator('presence', true)],
  // coverImage: [validator('presence', true)],
  privacy: [
    validator('presence', true),
    validator('inclusion', { in: ['open', 'closed', 'restricted'] })
  ],
  rules: [validator('presence', true)]
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
  tags: attr('array'),

  members: hasMany('group-member'),

  isOpen: equal('privacy', 'isOpen'),
  isClosed: equal('privacy', 'closed'),
  isRestricted: equal('privacy', 'restricted')
});
