import Controller from '@ember/controller';
import { inject as service } from '@ember/service';
import { set } from '@ember/object';

export default Controller.extend({
  session: service('session'),
  stripe: service('stripe'),

  buyingTier: null,
  // @josh comment this out to make the hall of fame be empty
  hallOfFame: ['Hi', 'Hi'],

  init() {
    this._super(...arguments);
    this.stripe.setup();
  },

  actions: {
    openCheckout() {
      this.stripe.openCheckout({
        image: 'assets/kitsu-256.png',
        name: 'Kitsu, Inc.',
        description: 'Kitsu PRO (Yearly)',
        zipCode: true,
        allowRememberMe: false,
        panelLabel: 'Subscribe for',
        email: this.session.account.email,
        amount: 1900
      });
    },

    buyTier(tier) {
      set(this, 'buyingTier', tier);
    }
  }
});
