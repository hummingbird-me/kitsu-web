import Controller from 'ember-controller';
import service from 'ember-service/inject';
import Config from 'client/config/environment';
import getter from 'client/utils/getter';
import observer from 'ember-metal/observer';
import get from 'ember-metal/get';
import set from 'ember-metal/set';

export default Controller.extend({
  queryParams: ['notification'],
  notification: null,
  ajax: service(),
  store: service(),
  isStaging: getter(() => Config.APP.isStaging),

  notificationTracker: observer('notification', function() {
    const notification = get(this, 'notification');
    if (notification === null || !get(this, 'session.hasUser')) return;

    const feedUrl = `/feeds/notifications/${get(this, 'session.account.id')}/_read`;

    get(this, 'ajax').request(feedUrl, {
      method: 'POST',
      data: JSON.stringify([notification]),
      contentType: 'application/json'
    }).then(() => {
      set(this, 'notification', null);
      const trackedItems = get(this, 'store').peekAll('notification').filterBy('streamId', notification);
      if (trackedItems.length === 1) {
        const [trackedItem] = trackedItems;
        set(trackedItem, 'isRead', true);
      }
    }).catch(() => {});
  })
});
