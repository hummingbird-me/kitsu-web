import Base from 'client/models/-base';
import attr from 'ember-data/attr';
import { belongsTo } from 'ember-data/relationships';
import { validator, buildValidations } from 'ember-cp-validations';
import { get, computed } from '@ember/object';
import { alias } from '@ember/object/computed';

const Validations = buildValidations({
  progress: [
    validator('number', {
      integer: true,
      gte: 0
    })
  ],
  reconsumeCount: [
    validator('number', {
      integer: true,
      gte: 0
    })
  ]
});

export const LIBRARY_STATUSES = ['current', 'planned', 'completed', 'on_hold', 'dropped'];
export default Base.extend(Validations, {
  finishedAt: attr('utc'),
  notes: attr('string'),
  progress: attr('number'),
  private: attr('boolean'),
  ratingTwenty: attr('rating'),
  reconsumeCount: attr('number'),
  startedAt: attr('utc'),
  status: attr('string'),
  updatedAt: attr('utc'),
  volumesOwned: attr('number'),

  anime: belongsTo('anime'),
  manga: belongsTo('manga'),
  review: belongsTo('review'),
  mediaReaction: belongsTo('media-reaction'),
  unit: belongsTo('-base'),
  nextUnit: belongsTo('-base'),
  user: belongsTo('user'),

  // Can't use `or` as it may try to load the anime relationship, so check values
  media: computed('anime', 'manga', function() {
    return this.belongsTo('anime').value() || this.belongsTo('manga').value();
  }).readOnly(),

  rating: alias('ratingTwenty'),

  ratingGroup: computed('rating', function() {
    const rating = get(this, 'rating');
    return this._getRatingGroup(rating);
  }).readOnly(),

  _getRatingGroup(rating) {
    if (rating > 0 && rating < 4) {
      return 'awful';
    }

    if (rating >= 4 && rating < 7) {
      return 'meh';
    }

    if (rating >= 7 && rating < 10) {
      return 'good';
    }
    return 'great';
  }
});
