import Component from 'ember-component';
import get from 'ember-metal/get';
import set from 'ember-metal/set';
import service from 'ember-service/inject';
import { task } from 'ember-concurrency';
import errorMessages from 'client/utils/error-messages';

export default Component.extend({
  tagName: 'span',
  classNames: ['group-actions'],

  notify: service(),

  editHiddenTask: task(function* (hidden) {
    const membership = get(this, 'membership');
    set(membership, 'hidden', hidden);
    yield membership.save()
      .catch((err) => {
        get(this, 'notify').error(errorMessages(err));
        membership.rollbackAttributes();
      });
  }).drop()
});
