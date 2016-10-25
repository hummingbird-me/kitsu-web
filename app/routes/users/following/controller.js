import Controller from 'ember-controller';
import service from 'ember-service/inject';
import IsOwnerMixin from 'client/mixins/is-owner';

export default Controller.extend(IsOwnerMixin, {
  session: service()
});
