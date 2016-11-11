import Route from 'ember-route';

export function initialize() {
  Route.reopen({
    activate() {
      this._super(...arguments);
      window.scrollTo(0, 0);
    }
  });
}

export default {
  name: 'route-scroll',
  initialize
};
