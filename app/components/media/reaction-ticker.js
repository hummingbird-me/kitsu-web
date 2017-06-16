import Component from 'ember-component';
import service from 'ember-service/inject';
import get from 'ember-metal/get';
import set from 'ember-metal/set';
import computed from 'ember-computed';
import { task, timeout } from 'ember-concurrency';

export default Component.extend({
  classNames: ['reaction-ticker'],
  queryCache: service(),
  index: 0,

  reaction: computed('index', 'getReactionsTask.last.value', function() {
    const reactions = get(this, 'getReactionsTask.last.value');
    return reactions.objectAt(get(this, 'index'));
  }).readOnly(),

  didReceiveAttrs() {
    this._super(...arguments);
    get(this, 'getReactionsTask').perform().then((reactions) => {
      get(this, 'tickerTask').perform(reactions);
    });
  },

  getReactionsTask: task(function* () {
    const media = get(this, 'media');
    const type = get(media, 'modelType');
    return yield get(this, 'queryCache').query('media-reaction', {
      include: 'user',
      filter: { [`${type}Id`]: get(media, 'id') },
      page: { limit: 6 },
      sort: '-upVotesCount'
    });
  }),

  tickerTask: task(function* (reactions) {
    while(true) {
      yield timeout(10000);
      const index = get(this, 'index');
      const next = index === get(reactions, 'length') - 1 ? 0 : index + 1;
      set(this, 'index', next);
    }
  }).drop(),
});
