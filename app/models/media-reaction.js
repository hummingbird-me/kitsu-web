import Base from 'client/models/-base';
import attr from 'ember-data/attr';
import { belongsTo, hasMany } from 'ember-data/relationships';

export default Base.extend({
  reaction: attr('string'),
  upVotesCount: attr('number'),

  libraryEntry: belongsTo('library-entry'),
  media: belongsTo('media'),
  user: belongsTo('user'),

  votes: hasMany('media-reaction-vote')
});
