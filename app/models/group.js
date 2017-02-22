import Base from 'client/models/-base';
import attr from 'ember-data/attr';
import { hasMany } from 'ember-data/relationships';

export default Base.extend({
  about: attr('string'),
  avatar: attr('object'),
  coverImage: attr('object'),
  locale: attr('string'),
  membersCount: attr('number'),
  name: attr('string'),
  nsfw: attr('boolean'),
  privacy: attr('string'),
  rules: attr('string'),
  rulesFormatted: attr('string'),
  slug: attr('string'),
  tags: attr('string'),

  members: hasMany('group-member')
});
