import Base from 'client/models/-base';
import attr from 'ember-data/attr';
import { belongsTo } from 'ember-data/relationships';
import computed from 'ember-computed';
import get from 'ember-metal/get';

export default Base.extend({
  progress: attr('number'),
  rating: attr('number'),
  reconsumeCount: attr('number'),
  status: attr('string'),

  actionPerformed: attr('string'),
  syncStatus: attr('string'),

  linkedAccount: belongsTo('linkedAccount'),
  media: belongsTo('media'),

  normalizedRating: computed('rating', function() {
    return get(this, 'rating') / 2;
  })
});
