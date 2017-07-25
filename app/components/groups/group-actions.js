import Component from 'ember-component';
import get from 'ember-metal/get';
import set from 'ember-metal/set';
import service from 'ember-service/inject';
import errorMessages from 'client/utils/error-messages';

export default Component.extend({
  tagName: 'span',
  classNames: ['group-actions'],

  notify: service(),

  actions: {
    editHidden(hidden) {
      const membership = get(this, 'membership');
      set(membership, 'hidden', hidden);
      membership.save()
        .catch((err) => {
          get(this, 'notify').error(errorMessages(err));
          membership.rollbackAttributes();
        });
    }
  }
});
