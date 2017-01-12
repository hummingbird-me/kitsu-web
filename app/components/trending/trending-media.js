import BaseComponent from 'client/components/trending/-base';
import { task } from 'ember-concurrency';

export default BaseComponent.extend({
  currentTab: 'anime',

  // TODO: Server API NYI
  getDataTask: task(function* (type) {
  }).restartable()
});
