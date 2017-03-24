import Controller from 'ember-controller';
import get from 'ember-metal/get';
import service from 'ember-service/inject';
import computed, { alias } from 'ember-computed';
import { task } from 'ember-concurrency';
import RSVP from 'rsvp';

const findLinkedAccount = kind => (
  computed('model.@each.isDeleted', function() {
    return get(this, 'model').findBy('kind', kind);
  }).readOnly()
);

export default Controller.extend({
  facebook: service(),
  torii: service(),
  youtubeAccount: findLinkedAccount('LinkedAccount::YoutubeChannel'),
  hasAccounts: alias('youtubeAccount'),

  // eslint-disable-next-line
  hasDirtyAccounts: computed('youtubeAccount.hasDirtyAttributes', function() {
    return ['youtubeAccount'].any(account => get(account, 'hasDirtyAttributes'));
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
    const token = yield get(this, 'torii').open('google-oauth2-bearer').then(response => (
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
      get(this, 'model').addObject(account);
    }).catch(() => {});
  }),

  destroyLink: task(function* (kind) {
    const account = get(this, 'model').findBy('kind', kind);
    yield account.destroyRecord().catch(() => {
      account.rollbackAttributes();
    });
  }),

  saveChangesTask: task(function* () {
    const accounts = [];
    ['youtubeAccount'].filterBy('hasDirtyAttributes').forEach((account) => {
      accounts.push(account);
    });
    yield RSVP.all(accounts);
  }),

  _getProviderType(kind) {
    switch (kind) {
      case 'LinkedAccount::YoutubeChannel':
        return 'google-oauth2-bearer';
      default:
        return null;
    }
  }
});
