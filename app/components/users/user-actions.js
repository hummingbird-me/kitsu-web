import Component from 'ember-component';
import get from 'ember-metal/get';
import set from 'ember-metal/set';
import service from 'ember-service/inject';
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
        .catch((err) => {
          get(this, 'notify').error(errorMessages(err));
          follow.rollbackAttributes();
        });
    }
  }
});
