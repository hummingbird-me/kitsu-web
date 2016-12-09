import Route from 'ember-route';

export function initialize() {
  Route.reopen({
    actions: {
      didTransition() {
        window.scroll(0, 0);
        return true;
      }
    }
  });
}

export default {
  name: 'route-scroll',
  initialize
};
