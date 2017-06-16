import Component from 'ember-component';
import get from 'ember-metal/get';
import set from 'ember-metal/set';
import service from 'ember-service/inject';
import { task } from 'ember-concurrency';

export default Component.extend({
  upvoted: false,

  queryCache: service(),
  store: service(),

  didReceiveAttrs() {
    this._super(...arguments);
    get(this, 'getUserVoteTask').perform();
  },

  actions: {
    toggleVote() {
      if (get(this, 'session.hasUser') === false) {
        return get(this, 'session.signUpModal')();
      }

      if (get(this, 'createVoteTask.isRunning') || get(this, 'destroyVoteTask.isRunning')) {
        return;
      }

      const upvoted = get(this, 'upvoted');
      if (upvoted === true) {
        get(this, 'destroyVoteTask').perform();
      } else {
        get(this, 'createVoteTask').perform();
      }
    }
  },

  getUserVoteTask: task(function* () {
    const queryCache = get(this, 'queryCache');
    const options = this._getRequestOptions();
    yield queryCache.query('media-reaction-vote', options).then((results) => {
      const userVote = get(results, 'firstObject');
      if (userVote !== undefined) {
        set(this, 'userVote', userVote);
        set(this, 'upvoted', true);
      }
    });
  }).drop(),

  createVoteTask: task(function* () {
    const reaction = get(this, 'reaction');
    const vote = get(this, 'store').createRecord('media-reaction-vote', {
      mediaReaction: get(this, 'reaction'),
      user: get(this, 'session.account')
    });

    set(this, 'upvoted', true);
    reaction.incrementProperty('upVotesCount');

    yield vote.save().then((userVote) => {
      set(this, 'userVote', userVote);
    }).catch(() => {
      set(this, 'upvoted', false);
      reaction.decrementProperty('upVotesCount');
    });
  }).drop(),

  destroyVoteTask: task(function* () {
    const reaction = get(this, 'reaction');
    const vote = get(this, 'userVote');

    set(this, 'upvoted', false);
    reaction.decrementProperty('upVotesCount');

    yield vote.destroyRecord().then(() => {
      const queryCache = get(this, 'queryCache');
      const options = this._getRequestOptions();
      queryCache.invalidateQuery('media-reaction-vote', options);
    }).catch(() => {
      set(this, 'upvoted', true);
      reaction.incrementProperty('upVotesCount');
    });
  }).drop(),

  _getRequestOptions() {
    const mediaReactionId = get(this, 'reaction.id');
    const userId = get(this, 'session.account.id');
    return {
      filter: { mediaReactionId, userId },
      page: { limit: 1 }
    };
  }
});
