import IntercomComponent from 'ember-intercom-io/components/intercom-io';
import get from 'ember-metal/get';
import set from 'ember-metal/set';
import service from 'ember-service/inject';

export default IntercomComponent.extend({
  session: service(),

  didInsertElement() {
    const data = {};
    if (get(this, 'session.hasUser') === true) {
      set(data, 'user_id', get(this, 'session.account.id'));
    }
    get(this, 'intercom').start(data);
  }
});
