import BaseComponent from 'client/components/trending/-base';
import get from 'ember-metal/get';
import { task } from 'ember-concurrency';
import { capitalize } from 'ember-string';
import FlickityActionsMixin from 'client/mixins/flickity-actions';

export default BaseComponent.extend(FlickityActionsMixin, {
  classNames: ['just-reviewed'],
  currentTab: 'anime',

  getDataTask: task(function* (type) {
    return yield get(this, 'queryCache').query('review', {
      filter: {
        media_type: capitalize(type)
      },
      include: 'user,media',
      sort: '-created_at',
      page: { limit: 14 }
    });
  }).restartable()
});
