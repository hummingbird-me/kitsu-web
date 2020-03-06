import Component from '@ember/component';
import { get, set, computed } from '@ember/object';
import { inject as service } from '@ember/service';
import { or } from '@ember/object/computed';
import { htmlSafe } from '@ember/string';
import { task } from 'ember-concurrency';
import errorMessages from 'client/utils/error-messages';
import { image } from 'client/helpers/image';
import ClipboardMixin from 'client/mixins/clipboard';

export default Component.extend(ClipboardMixin, {
  large: false,
  isUpvoted: false,
  queryCache: service(),
  store: service(),
  tasksRunning: or('getUserVoteTask.isRunning', 'createVoteTask.isRunning', 'destroyVoteTask.isRunning'),

  canDelete: computed('session.account', 'reaction', function() {
    const currentUser = get(this, 'session.hasUser') && get(this, 'session.account');
    if (!currentUser) {
      return false;
    }
    if (currentUser.hasRole('admin', get(this, 'reaction'))) {
      return true;
    }
    if (get(currentUser, 'id') === get(this, 'reaction.user.id')) {
      return true;
    }
  }),

  posterImageStyle: computed('media.posterImage', function() {
    const posterImage = image(get(this, 'media.posterImage'), get(this, 'large') ? 'large' : 'medium');
    return htmlSafe(`background-image: url("${posterImage}")`);
  }).readOnly(),

  init() {
    this._super(...arguments);
    set(this, 'host', `${window.location.protocol}//${window.location.host}`);
  },

  didReceiveAttrs() {
    this._super(...arguments);
    if (get(this, 'session.hasUser')) {
      get(this, 'getUserVoteTask').perform();
    }
  },

  getUserVoteTask: task(function* () {
    const options = this._getRequestOptions();
    const response = yield get(this, 'queryCache').query('media-reaction-vote', options);
    const userVote = get(response, 'firstObject');
    if (userVote) {
      set(this, 'userVote', userVote);
      set(this, 'isUpvoted', true);
    }
  }).drop(),

  createVoteTask: task(function* () {
    const reaction = get(this, 'reaction');
    const vote = get(this, 'store').createRecord('media-reaction-vote', {
      mediaReaction: get(this, 'reaction'),
      user: get(this, 'session.account')
    });
    set(this, 'isUpvoted', true);
    reaction.incrementProperty('upVotesCount');
    try {
      yield vote.save();
      set(this, 'userVote', vote);
    } catch (err) {
      set(this, 'isUpvoted', false);
      reaction.decrementProperty('upVotesCount');
    }
  }).drop(),

  destroyVoteTask: task(function* () {
    const reaction = get(this, 'reaction');
    const vote = get(this, 'userVote');
    set(this, 'isUpvoted', false);
    reaction.decrementProperty('upVotesCount');
    try {
      yield vote.destroyRecord();
      const queryCache = get(this, 'queryCache');
      const options = this._getRequestOptions();
      queryCache.invalidateQuery('media-reaction-vote', options);
    } catch (err) {
      set(this, 'isUpvoted', false);
      reaction.incrementProperty('upVotesCount');
    }
  }).drop(),

  actions: {
    toggleVote() {
      if (!get(this, 'session.hasUser')) {
        return get(this, 'session').signUpModal();
      }
      if (get(this, 'tasksRunning.isRunning')) {
        return;
      }
      const task = get(this, 'isUpvoted') ? 'destroyVoteTask' : 'createVoteTask';
      get(this, task).perform();
    },

    deleteReaction() {
      if (get(this, 'reaction.isDeleted')) { return; }
      get(this, 'reaction').destroyRecord()
        .catch(err => {
          get(this, 'reaction').rollbackAttributes();
          get(this, 'notify').error(errorMessages(err));
        });
    },
  },

  _getRequestOptions() {
    const mediaReactionId = get(this, 'reaction.id');
    const userId = get(this, 'session.account.id');
    return {
      filter: { mediaReactionId, userId },
      page: { limit: 1 }
    };
  }
});
