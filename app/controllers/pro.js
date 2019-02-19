import Controller from '@ember/controller';
import { inject as service } from '@ember/service';

export default Controller.extend({
  session: service('session'),
  stripe: service('stripe'),

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
    }
  }
});
