import Base from 'client/models/-base';
import attr from 'ember-data/attr';
import get from 'ember-metal/get';
import { belongsTo } from 'ember-data/relationships';
import { validator, buildValidations } from 'ember-cp-validations';
import computed from 'ember-computed';

const Validations = buildValidations({
  progress: [
    validator('presence', true),
    validator('number', {
      integer: true,
      gte: 0
    })
  ],
  reconsumeCount: [
    validator('presence', true),
    validator('number', {
      integer: true,
      gte: 0
    })
  ]
});

export default Base.extend(Validations, {
  progress: attr('number'),
  notes: attr('string'),
  private: attr('boolean'),
  rating: attr('rating'),
  reconsumeCount: attr('number'),
  status: attr('string'),
  updatedAt: attr('utc'),

  anime: belongsTo('anime'),
  manga: belongsTo('manga'),
  review: belongsTo('review'),
  unit: belongsTo('-base'),
  nextUnit: belongsTo('-base'),
  user: belongsTo('user'),

  // Can't use `or` as it may try to load the anime relationship, so check values
  media: computed('anime', 'manga', function() {
    return this.belongsTo('anime').value() || this.belongsTo('manga').value();
  }).readOnly(),

  ratingGroup: computed('rating', function() {
    const rating = get(this, 'rating');
    return this._getRatingGroup(rating);
  }).readOnly(),

  _getRatingGroup(rating) {
    if (rating > 0 && rating < 4) {
      return 'awful';
    } else if (rating >= 4 && rating < 7) {
      return 'meh';
    } else if (rating >= 7 && rating < 10) {
      return 'good';
    }
    return 'amazing';
  }
});
