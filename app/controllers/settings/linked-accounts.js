import Controller from 'ember-controller';
import get from 'ember-metal/get';
import set from 'ember-metal/set';
import service from 'ember-service/inject';
import computed, { collect } from 'ember-computed';
import { task } from 'ember-concurrency';
import RSVP from 'rsvp';
import errorMessages from 'client/utils/error-messages';

const findLinkedAccount = kind => (
  computed('model.[]', function() {
    return get(this, 'model').findBy('kind', kind);
  }).readOnly()
);

export default Controller.extend({
  facebook: service(),
  notify: service(),
  torii: service(),

  youtubeAccount: findLinkedAccount('youtube-channel'),
  allAccounts: collect('youtubeAccount'),

  hasAccounts: computed('allAccounts.[]', function() {
    return get(this, 'allAccounts').any(account => account !== null);
  }).readOnly(),

  hasDirtyAccounts: computed('allAccounts.@each.hasDirtyAttributes', function() {
    return get(this, 'allAccounts').any(account => (
      account ? get(account, 'hasDirtyAttributes') : false
     ));
  }).readOnly(),

  connectFacebook: task(function* () {
    yield get(this, 'facebook').connect(get(this, 'session.account')).catch(() => {
      get(this, 'session.account').rollbackAttributes();
    });
  }),

  disconnectFacebook: task(function* () {
    yield get(this, 'facebook').disconnect(get(this, 'session.account')).catch(() => {
      get(this, 'session.account').rollbackAttributes();
    });
  }),

  createLink: task(function* (kind) {
    // get token
    const provider = this._getProviderType(kind);
    if (!provider) { return; }
    const token = yield get(this, 'torii').open(provider).then(response => (
      response.authorizationToken.access_token
    )).catch(() => {});
    if (!token) { return; }

    // create linked account
    const account = get(this, 'store').createRecord('linked-account', {
      kind,
      token,
      user: get(this, 'session.account')
    });
    yield account.save().then(() => {
      const content = get(this, 'model').toArray();
      content.addObject(account);
      set(this, 'model', content);
    }).catch(() => {});
  }),

  destroyLink: task(function* (kind) {
    const account = get(this, 'model').findBy('kind', kind);
    yield account.destroyRecord().then(() => {
      get(this, 'model').removeObject(account);
    }).catch(() => {
      account.rollbackAttributes();
    });
  }),

  saveChangesTask: task(function* () {
    if (get(this, 'destroyLink.isRunning') || get(this, 'createLink.isRunning')) { return; }

    const accounts = get(this, 'allAccounts').filterBy('hasDirtyAttributes')
      .map(account => account.save());
    yield RSVP.all(accounts).catch((error) => {
      get(this, 'notify').error(errorMessages(error));
    });
  }).drop(),

  _getProviderType(kind) {
    switch (kind) {
      case 'youtube-channel':
        return 'google-oauth2-bearer';
      default:
        return null;
    }
  }
});
