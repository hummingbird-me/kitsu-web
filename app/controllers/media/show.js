import Controller from 'ember-controller';
import computed, { alias } from 'ember-computed';
import get from 'ember-metal/get';
import service from 'ember-service/inject';
import { image } from 'client/helpers/image';

export default Controller.extend({
  media: alias('model'),
  session: service(),

  schemaData: computed('media', function() {
    return this._schemaData();
  }).readOnly(),

  // Determine if the streamers are loaded so we can show a async loading state
  isStreamersLoaded: computed('media.streamingLinks.@each.streamer', {
    get() {
      const links = get(this, 'media.streamingLinks');
      if (get(links, 'isLoaded') === false) {
        return false;
      }
      return get(this, 'media.streamingLinks').toArray()
        .map(r => get(r, 'streamer'))
        .every(r => get(r, 'isLoaded') === true);
    }
  }).readOnly(),

  coverImageStyle: computed('media.coverImage', {
    get() {
      const coverImage = image(get(this, 'media.coverImage'));
      return `background-image: url("${coverImage}")`.htmlSafe();
    }
  }).readOnly(),

  _schemaData() {
    const data = [{
      type: 'meta',
      name: 'name',
      content: get(this, 'media.canonicalTitle')
    }, {
      type: 'meta',
      name: 'description',
      content: get(this, 'media.synopsis')
    }, {
      type: 'link',
      name: 'image',
      content: get(this, 'media.posterImage.large')
    }];
    get(this, 'media.genres').mapBy('name').forEach((genre) => {
      data.push({
        type: 'meta',
        name: 'genre',
        content: genre
      });
    });
    if (get(this, 'media.averageRating')) {
      data.push({
        type: 'scope',
        name: 'aggregateRating',
        scope: 'AggregateRating',
        content: [{
          type: 'meta',
          name: 'bestRating',
          content: '5.0'
        }, {
          type: 'meta',
          name: 'worstRating',
          content: '0.5'
        }, {
          type: 'meta',
          name: 'ratingValue',
          content: get(this, 'media.averageRating').toFixed(2)
        }, {
          type: 'meta',
          name: 'ratingCount',
          content: get(this, 'media.totalRatings')
        }]
      });
    }
    if (get(this, 'media.startDate')) {
      data.push({
        type: 'meta',
        name: 'startDate',
        content: get(this, 'media.startDate').format('YYYY-MM-DD')
      });
    }
    if (get(this, 'media.endDate')) {
      data.push({
        type: 'meta',
        name: 'endDate',
        content: get(this, 'media.endDate').format('YYYY-MM-DD')
      });
    }
    return data;
  }
});
