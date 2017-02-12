import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';
import wait from 'ember-test-helpers/wait';
import Pretender from 'pretender';
import { jsonFactory as json } from 'client/tests/helpers/json';

moduleForComponent('dashboard/kitsu-forums', 'Integration | Component | dashboard/kitsu-forums', {
  integration: true,

  beforeEach() {
    this.server = new Pretender();
    const service = this.container.lookup('service:intl');
    service.setLocale('en-us');
  },

  afterEach() {
    this.server.shutdown();
  }
});

test('data is handled correctly', function(assert) {
  const data = {
    topic_list: {
      topics: [
        { title: 'First Topic', slug: 'first-topic', id: 1 },
        { title: 'Second Topic', slug: 'second-topic', id: 2 },
        { title: 'Third Topic', slug: 'third-topic', id: 3 },
        { title: 'Forth Topic', slug: 'forth-topic', id: 4 },
        { title: 'Fifth Topic', slug: 'fifth-topic', id: 5 }
      ]
    }
  };

  this.server.get('https://example.com/test.json', json(200, data), 300);
  this.render(hbs`{{dashboard/kitsu-forums
    endpoint="https://example.com/test.json"
  }}`);

  return wait().then(() => {
    const items = this.$('li');
    assert.equal(items.length, 4);
    assert.equal(items.eq(0).find('a').text().trim(), 'Second Topic');
  });
});
