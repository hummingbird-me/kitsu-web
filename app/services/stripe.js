import Service, { inject as service } from '@ember/service';
import config from 'client/config/environment';
import injectScript from 'client/utils/inject-script';

const STRIPE_JS = 'https://checkout.stripe.com/checkout.js';

export default Service.extend({
  router: service('router'),

  async setup() {
    await injectScript(STRIPE_JS);
  },

  async openCheckout(params) {
    await this.setup();

    return new Promise((resolve) => {
      const checkout = window.StripeCheckout.configure({
        key: config.stripe.key,
        image: 'https://stripe.com/img/documentation/checkout/marketplace.png',
        locale: 'auto',
        token: token => resolve(token)
      });

      // Hook onto router event to close checkout on navigation
      const close = () => checkout.close();
      this.router.one('routeWillChange', close);
      // And unhook that event if the checkout closes
      checkout.open({
        ...params,
        closed() {
          this.router.off('routeWillChange', close);
        }
      });
    });
  }
});
