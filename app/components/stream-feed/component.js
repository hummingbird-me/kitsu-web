import Component from 'ember-component';
import { task } from 'ember-concurrency';
import get, { getProperties } from 'ember-metal/get';
import set from 'ember-metal/set';
import service from 'ember-service/inject';
import { isEmpty } from 'ember-utils';

export default Component.extend({
  readOnly: false,
  store: service(),

  getFeedData: task(function* (type, id) {
    // TODO: Remove ridiculous include when API links work
    return yield get(this, 'store').query('feed', {
      type,
      id,
      include: 'media,actor,unit,subject.user,subject.target_user,subject.post_likes.user,subject.comments.user'
    });
  }).restartable(),

  didReceiveAttrs() {
    this._super(...arguments);
    const { streamType, streamId } = getProperties(this, 'streamType', 'streamId');
    if (isEmpty(streamType) || isEmpty(streamId)) {
      return;
    }
    get(this, 'getFeedData').perform(streamType, streamId)
      .then(data => set(this, 'feed', data));
  }
});
