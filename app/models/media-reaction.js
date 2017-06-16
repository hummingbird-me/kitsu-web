import Base from 'client/models/-base';
import attr from 'ember-data/attr';
import { belongsTo, hasMany } from 'ember-data/relationships';
import { validator, buildValidations } from 'ember-cp-validations';

export const Validations = buildValidations({
  reaction: [
    validator('presence', true),
    validator('length', { max: 140 })
  ]
});

export default Base.extend(Validations, {
  mediaType: attr('string'),
  reaction: attr('string'),
  upVotesCount: attr('number'),

  libraryEntry: belongsTo('library-entry'),
  anime: belongsTo('anime'),
  manga: belongsTo('manga'),
  user: belongsTo('user'),

  votes: hasMany('media-reaction-vote')
});
