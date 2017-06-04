import Base from 'client/models/-base';
import attr from 'ember-data/attr';
import { belongsTo, hasMany } from 'ember-data/relationships';

export default Base.extend({
  mediaType: attr('string'),
  reaction: attr('string'),
  upVotesCount: attr('number'),

  libraryEntry: belongsTo('library-entry', { inverse: null }),
  anime: belongsTo('anime'),
  manga: belongsTo('manga'),
  user: belongsTo('user'),

  votes: hasMany('media-reaction-vote')
});
