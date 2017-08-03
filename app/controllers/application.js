import Controller from 'ember-controller';
import get from 'ember-metal/get';
import set from 'ember-metal/set';
import service from 'ember-service/inject';
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

  init() {
    this._super(...arguments);
    // create the one-signal-player when user subscribes
    window.OneSignal.push(() => {
      window.OneSignal.on('subscriptionChange', (isSubscribed) => {
        if (isSubscribed && get(this, 'session.isAuthenticated')) {
          window.OneSignal.getUserId().then((userId) => {
            get(this, 'store').createRecord('one-signal-player', {
              playerId: userId,
              platform: 'web',
              user: get(this, 'session.account')
            }).save();
          });
        }
      });
    });
  },

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
