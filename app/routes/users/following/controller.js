import Controller from 'ember-controller';
import service from 'ember-service/inject';
import get from 'ember-metal/get';
import set from 'ember-metal/set';
import IsOwnerMixin from 'client/mixins/is-owner';

export default Controller.extend(IsOwnerMixin, {
  session: service(),
  lazy: service(),

  modelSizeChanged: function() {
    get(this, 'lazy').setTreshold(get(this, 'lazyId'), get(this, 'model.length'));
  }.observes('model.length'),

  init() {
    this._super(...arguments);
    set(this, 'lazyId', get(this, 'lazy').create('follow', 'followed'));
  }
});
