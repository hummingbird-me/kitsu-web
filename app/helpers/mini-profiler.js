import Helper from 'ember-helper';
import service from 'ember-service/inject';
import get from 'ember-metal/get';
import set from 'ember-metal/set';
import { isEmpty } from 'ember-utils';
import observer from 'ember-metal/observer';

export default Helper.extend({
  session: service(),
  isInserted: false,

  compute() {
    if (isEmpty(get(this, 'session.account')) || get(this, 'isInserted')) {
      return;
    }

    if (get(this, 'session.account').hasRole('admin')) {
      const element = document.createElement('script');
      element.async = true;
      element.src = '/mini-profiler-resources/includes.js?v=12b4b45a3c42e6e15503d7a03810ff33';
      element.id = 'mini-profiler';
      element.dataset.version = '12b4b45a3c42e6e15503d7a03810ff33';
      element.dataset.path = '/mini-profiler-resources/';
      element.dataset.currentId = 'redo66j4g1077kto8uh3';
      element.dataset.ids = 'redo66j4g1077kto8uh3';
      element.dataset.position = 'left';
      element.dataset.trivial = false;
      element.dataset.children = false;
      element.dataset.maxTraces = 10;
      element.dataset.controls = false;
      element.dataset.authorized = true;
      element.dataset.toggleShortcut = 'Alt+P';
      element.dataset.startHidden = false;
      element.dataset.collapseResults = true;
      const script = document.getElementsByTagName('script')[0];
      script.parentNode.insertBefore(element, script);
      set(this, 'isInserted', true);
    }
  },

  didAuthenticate: observer('session.hasUser', function() {
    this.recompute();
  })
});
