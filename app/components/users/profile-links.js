import Component from 'ember-component';
import get from 'ember-metal/get';
import service from 'ember-service/inject';
import ClipboardMixin from 'client/mixins/clipboard';

export default Component.extend(ClipboardMixin, {
  notify: service(),

  actions: {
    copyNotification(content) {
      get(this, 'notify').success(`${content} was copied to your clipboard!`);
    }
  }
});
