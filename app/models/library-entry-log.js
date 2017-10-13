import Base from 'client/models/-base';
import attr from 'ember-data/attr';
import { belongsTo } from 'ember-data/relationships';
import { get, computed } from '@ember/object';

export default Base.extend({
  actionPerformed: attr('string'),
  createdAt: attr('utc'),
  errorMessage: attr('string'),
  progress: attr('number'),
  rating: attr('rating'),
  reconsumeCount: attr('number'),
  status: attr('string'),
  syncStatus: attr('string'),

  linkedAccount: belongsTo('linked-account'),
  media: belongsTo('media'),

  formattedDate: computed('createdAt', function() {
    return get(this, 'createdAt').format('YYYY-MM-DD');
  })
});
