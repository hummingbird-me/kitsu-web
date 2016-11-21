import Controller from 'ember-controller';
import get from 'ember-metal/get';
import set from 'ember-metal/set';
import controller from 'ember-controller/inject';
import { alias } from 'ember-computed';
import { scheduleOnce } from 'ember-runloop';

export default Controller.extend({
  media: alias('parent.media'),

  init() {
    this._super(...arguments);
    scheduleOnce('routerTransitions', () => {
      const [key] = get(this, 'target.currentRouteName').split('.');
      set(this, 'parent', controller(`${key}.show`));
    });
  }
});
