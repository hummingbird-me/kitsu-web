import Component from '@ember/component';
import { get, set } from '@ember/object';
import { inject as service } from '@ember/service';
import errorMessages from 'client/utils/error-messages';

export default Component.extend({
  tagName: 'span',
  classNames: ['user-actions'],

  notify: service(),

  actions: {
    editHidden(hidden) {
      const follow = get(this, 'follow');
      set(follow, 'hidden', hidden);
      follow.save()
        .catch(err => {
          get(this, 'notify').error(errorMessages(err));
          follow.rollbackAttributes();
        });
    }
  }
});
