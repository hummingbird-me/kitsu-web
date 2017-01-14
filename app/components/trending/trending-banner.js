import Component from 'ember-component';
import get from 'ember-metal/get';
import service from 'ember-service/inject';
import { task, timeout } from 'ember-concurrency';

export default Component.extend({
  tagName: 'section',
  classNames: ['trending-banner'],
});
