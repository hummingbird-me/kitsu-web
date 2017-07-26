import ReactionComponent from 'client/components/media/media-reaction-card';
import set from 'ember-metal/set';
import ClipboardMixin from 'client/mixins/clipboard';

export default ReactionComponent.extend(ClipboardMixin, {
  init() {
    this._super(...arguments);
    set(this, 'classNames', []);
    set(this, 'host', `${location.protocol}//${location.host}`);
  },
});
