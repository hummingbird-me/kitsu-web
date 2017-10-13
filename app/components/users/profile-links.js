import Component from '@ember/component';
import { get } from '@ember/object';
import { inject as service } from '@ember/service';
import ClipboardMixin from 'client/mixins/clipboard';

export default Component.extend(ClipboardMixin, {
  notify: service(),

  actions: {
    copyNotification(content) {
      get(this, 'notify').success(`${content} was copied to your clipboard!`);
    }
  }
});
