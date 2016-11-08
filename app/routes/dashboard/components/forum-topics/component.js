import Component from 'ember-component';
import { task } from 'ember-concurrency';
import service from 'ember-service/inject';
import get from 'ember-metal/get';
import set from 'ember-metal/set';

export default Component.extend({
  endpoint: 'https://forums.hummingbird.me/c/industry-news.json',

  ajax: service(),

  getTopics: task(function* () {
    const endpoint = get(this, 'endpoint');
    return yield get(this, 'ajax').request(endpoint);
  }),

  init() {
    this._super(...arguments);
    get(this, 'getTopics').perform().then((data) => {
      const topics = get(data, 'topic_list.topics') || undefined;
      if (topics !== undefined) {
        topics.slice(0, 4).map(topic => ({
          title: topic.title,
          href: `https://forums.hummingbird.me/t/${topic.slug}/${topic.id}`
        }));
        set(this, 'topics', topics);
      }
    }).catch(() => {});
  }
});
