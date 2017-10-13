import Controller from '@ember/controller';
import { get, set } from '@ember/object';
import { inject as service } from '@ember/service';
import QueryParams from 'ember-parachute';
import Config from 'client/config/environment';

const queryParams = new QueryParams({
  notification: {
    defaultValue: null
  }
});

export default Controller.extend(queryParams.Mixin, {
  isStaging: Config.kitsu.isStaging,
  ajax: service(),
  store: service(),

  queryParamsDidChange({ changed: { notification } }) {
    if (notification && get(this, 'session.hasUser')) {
      this._markNotificationRead(notification).finally(() => {
        set(this, 'notification', null);
      });
    }
  },

  _markNotificationRead(notification) {
    // send off read event
    const feedUrl = `/feeds/notifications/${get(this, 'session.account.id')}/_read`;
    return get(this, 'ajax').request(feedUrl, {
      method: 'POST',
      data: JSON.stringify([notification]),
      contentType: 'application/json'
    }).then(() => {
      // reset default value
      const trackedItem = get(this, 'store').peekAll('notification').findBy('streamId', notification);
      if (trackedItem) {
        set(trackedItem, 'isRead', true);
      }
    });
  }
});
