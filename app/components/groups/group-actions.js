import Component from '@ember/component';
import { get, set } from '@ember/object';
import { inject as service } from '@ember/service';
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
        .catch(err => {
          get(this, 'notify').error(errorMessages(err));
          membership.rollbackAttributes();
        });
    }
  }
});
