import Component from '@ember/component';
import { isEmpty } from '@ember/utils';
import { get, set } from '@ember/object';
import { inject as service } from '@ember/service';
import { notEmpty } from '@ember/object/computed';
import { task } from 'ember-concurrency';
import { invoke } from 'ember-invoke-action';
import File from 'ember-file-upload/file';
import config from 'client/config/environment';
import errorMessages from 'client/utils/error-messages';
import isFileValid from 'client/utils/is-file-valid';

export default Component.extend({
  classNames: ['comment-box'],
  upload: undefined,
  accept: 'image/jpg, image/jpeg, image/png, image/gif',
  dropzoneDisabled: notEmpty('upload'),
  notify: service(),
  store: service(),
  fileQueue: service(),
  raven: service(),

  uploadImageTask: task(function* (file) {
    const { access_token: accessToken } = get(this, 'session.data.authenticated');
    const headers = {
      accept: 'application/vnd.api+json',
      authorization: `Bearer ${accessToken}`
    };
    try {
      if (!isFileValid(file, get(this, 'accept'))) {
        const queue = get(this, 'fileQueue').find(`comment-uploads-${get(this, 'elementId')}`);
        const files = get(queue, 'files');
        files.removeObject(file);
        set(file, 'queue', null);
        return;
      }

      const { body } = yield file.upload(`${config.kitsu.APIHost}/api/edge/uploads/_bulk`, {
        fileKey: 'files[]',
        headers
      });
      const store = get(this, 'store');
      store.pushPayload(body);
      set(this, 'upload', store.peekRecord('upload', body.data[0].id));
    } catch (error) {
      get(this, 'raven').captureException(error);
      get(this, 'notify').error(errorMessages(error));

      const queue = get(this, 'fileQueue').find(`comment-uploads-${get(this, 'elementId')}`);
      const files = get(queue, 'files');
      const failedFiles = files.filter(file => ['failed', 'timed_out'].indexOf(file.state) !== -1);
      failedFiles.forEach(file => {
        files.removeObject(file);
        set(file, 'queue', null);
      });
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
    }
  }
});
