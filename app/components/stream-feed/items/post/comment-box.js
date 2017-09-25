import Component from 'ember-component';
import { isEmpty } from 'ember-utils';
import get from 'ember-metal/get';
import set from 'ember-metal/set';
import service from 'ember-service/inject';
import { notEmpty } from 'ember-computed';
import { A } from 'ember-array/utils';
import { task } from 'ember-concurrency';
import { invoke } from 'ember-invoke-action';
import File from 'ember-file-upload/file';
import config from 'client/config/environment';
import errorMessages from 'client/utils/error-messages';

export default Component.extend({
  classNames: ['comment-box'],
  upload: undefined,
  accept: 'image/jpg, image/jpeg, image/png, image/gif',
  dropzoneDisabled: notEmpty('upload'),
  notify: service(),
  store: service(),
  fileQueue: service(),

  uploadImageTask: task(function* (file) {
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
      const queue = get(this, 'fileQueue').find(`comment-uploads-${get(this, 'elementId')}`);
      get(queue, 'files').forEach(file => set(file, 'queue', null));
      set(queue, 'files', A());
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

    paste(event) {
      const { items } = event.clipboardData;
      const accept = get(this, 'accept');
      let image;
      let i = 0;
      while (!image && i < items.length) {
        if (accept.includes(items[i].type)) {
          event.preventDefault();
          image = items[i].getAsFile();
        }
        i += 1;
      }
      if (image) {
        const reader = new FileReader();
        reader.addEventListener('load', () => {
          get(this, 'uploadImageTask').perform(File.fromDataURL(reader.result));
        });
        reader.readAsDataURL(image);
      }
    },

    removeUpload() {
      set(this, 'upload', undefined);
    },
  }
});
