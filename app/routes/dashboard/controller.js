import Controller from 'ember-controller';
import service from 'ember-service/inject';
import getter from 'client/utils/getter';

export default Controller.extend({
  session: service(),

  /**
   * TODO/FEED: Should determine from session.account whether we should load
   * timeline or global.
   */
  streamType: getter(() => 'timeline')
});
