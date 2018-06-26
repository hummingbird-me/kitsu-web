import Component from '@ember/component';
import { isEmpty } from '@ember/utils';
import { get, set } from '@ember/object';
import { inject as service } from '@ember/service';
import { notEmpty } from '@ember/object/computed';
import { task } from 'ember-concurrency';
import { invoke } from 'ember-invoke-action';
import config from 'client/config/environment';
import errorMessages from 'client/utils/error-messages';
import isFileValid from 'client/utils/is-file-valid';

const LINK_REGEX = /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,4}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/gi;

export default Component.extend({
  classNames: ['comment-box'],
  content: null,
  upload: undefined,
  embedUrl: undefined,
  accept: 'image/jpg, image/jpeg, image/png, image/gif',
  dropzoneDisabled: notEmpty('upload'),

  ajax: service(),
  notify: service(),
  store: service(),
  fileQueue: service(),
  raven: service(),

  init() {
    this._super(...arguments);
    this.set('embeds', []);
  },

  uploadImageTask: task(function* (file) {
    const { access_token: accessToken } = get(this, 'session.data.authenticated');
    const headers = {
      accept: 'application/vnd.api+json',
      authorization: `Bearer ${accessToken}`
    };
    try {
      if (!isFileValid(get(file, 'blob'), get(this, 'accept'))) {
        const queue = get(this, 'fileQueue').find(`comment-uploads-${get(this, 'elementId')}`);
        const files = get(queue, 'files');
        files.removeObject(file);
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
      failedFiles.forEach((file) => {
        files.removeObject(file);
      });
    }
  }).drop(),

  previewEmbedTask: task(function* () {
    const url = this.get('embeds.firstObject');
    if (!url) { return; }
    return yield this.get('ajax').request('/embeds', {
      method: 'POST',
      data: { url }
    });
  }).restartable(),

  actions: {
    submit(component, event, content) {
      if (isEmpty(content) === true && isEmpty(get(this, 'upload')) === true) { return; }
      const { shiftKey } = event;
      if (shiftKey === false) {
        event.preventDefault();
        get(this, 'onSubmit').perform(content, this.get('embeds.firstObject'));
        component.clear();
        invoke(this, 'removeUpload');
        this.set('embeds', []);
        this.set('embedUrl', undefined);
      }
    },

    paste(event) {
      const { items } = event.clipboardData;
      let image;
      let i = 0;
      while (!image && i < items.length) {
        const file = items[i].getAsFile();
        if (file && isFileValid(file, get(this, 'accept'))) {
          event.preventDefault();
          image = file;
        }
        i += 1;
      }
      if (image) {
        const queue = get(this, 'fileQueue').find(`comment-uploads-${get(this, 'elementId')}`);
        queue._addFiles([image]);
      }
    },

    removeUpload() {
      set(this, 'upload', undefined);
    },

    processLinks() {
      const content = this.get('content');
      if (isEmpty(content)) {
        this.set('embeds', []);
        return;
      }

      const links = content.match(LINK_REGEX);
      if (links && links.length > 0) {
        const embeds = this.get('embeds');
        const length = embeds.get('length');
        embeds.addObjects(links);

        // only run the preview task when the embeds are empty
        if (length === 0) {
          this.set('embedUrl', embeds.get('firstObject'));
          this.get('previewEmbedTask').perform();
        }
      } else {
        this.set('embeds', []);
      }
    },

    removeEmbed() {
      const embeds = this.get('embeds');
      embeds.removeObject(embeds.get('firstObject'));
      this.set('embedUrl', embeds.get('firstObject'));
      this.get('previewEmbedTask').perform();
    }
  }
});
