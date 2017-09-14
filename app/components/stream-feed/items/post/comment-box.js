import Component from 'ember-component';
import { isEmpty } from 'ember-utils';
import get from 'ember-metal/get';
import set from 'ember-metal/set';
import service from 'ember-service/inject';
import { notEmpty } from 'ember-computed';
import { task } from 'ember-concurrency';
import { invoke } from 'ember-invoke-action';
import config from 'client/config/environment';
import errorMessages from 'client/utils/error-messages';

export default Component.extend({
  classNames: ['comment-box'],
  upload: undefined,
  dropzoneDisabled: notEmpty('upload'),
  notify: service(),
  store: service(),

  uploadImage: task(function* (file) {
    const headers = { accept: 'application/vnd.api+json' };
    get(this, 'session').authorize('authorizer:application', (headerName, headerValue) => {
      headers[headerName] = headerValue;
    });
    try {
      const { body } = yield file.upload(`${config.kitsu.APIHost}/api/edge/uploads/_bulk`, {
        fileKey: 'files[]',
        headers
      });
      const store = get(this, 'store');
      store.pushPayload(body);
      set(this, 'upload', store.peekRecord('upload', body.data[0].id));
    } catch (error) {
      get(this, 'notify').error(errorMessages(error));
    }
  }).drop(),

  actions: {
    submit(component, event, content) {
      if (isEmpty(content) === true && isEmpty(get(this, 'upload')) === true) { return; }
      const { shiftKey } = event;
      if (shiftKey === false) {
        event.preventDefault();
        get(this, 'onSubmit').perform(content);
        component.clear();
        invoke(this, 'removeUpload');
      }
    },

    removeUpload() {
      set(this, 'upload', undefined);
    },
  }
});
