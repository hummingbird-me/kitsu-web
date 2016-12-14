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
  session: service(),
  isStaging: getter(() => Config.isStaging),

  notificationTracker: observer('notification', function() {
    const notification = get(this, 'notification');
    if (notification === null) return;

    const feedUrl = `/feeds/notifications/${get(this, 'session.account.id')}/_read`;

    return get(this, 'ajax').request(feedUrl, {
      method: 'POST',
      data: JSON.stringify([notification]),
      contentType: 'application/json'
    }).then((payload) => {
      set(this, 'notification', null);
    }).catch(() => {});
  })
});
