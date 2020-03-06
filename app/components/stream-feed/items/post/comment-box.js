import Component from '@ember/component';
import { isEmpty, isPresent } from '@ember/utils';
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
    this.set('skippedEmbeds', []);
  },

  uploadImageTask: task(function* (file) {
    const { access_token: accessToken } = get(this, 'session.data.authenticated');
    const headers = {
      accept: 'application/vnd.api+json',
      authorization: `Bearer ${accessToken}`
    };
    try {
      if (!isFileValid(get(file, 'blob'), get(this, 'accept'))) {
        set(file, 'state', 'aborted');
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
        set(file, 'status', 'aborted');
      });
    }
  }).drop(),

  previewEmbedTask: task(function* () {
    const url = this.get('embedUrl');
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
        get(this, 'onSubmit').perform(content, this.get('embedUrl'));
        component.clear();
        invoke(this, 'removeUpload');
        this.set('skippedEmbeds', []);
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
      invoke(this, 'processLinks', this.get('content'));
    },

    // This action is executed everytime the content of the text-area is changed
    processLinks(content, force = false) {
      // reset the skipped embeds if the content is empty (this will be from a deletion)
      if (isEmpty(content) || (isPresent(this.get('fileQueue.files')) || this.get('upload'))) {
        this.set('skippedEmbeds', []);
        return;
      }

      // find all the links within the text
      if (force || isEmpty(this.get('embedUrl'))) {
        const links = content.match(LINK_REGEX);
        if (links && links.length > 0) {
          const skipped = this.get('skippedEmbeds');
          const embeds = links.reject(link => skipped.includes(link));
          this.set('embedUrl', embeds.get('firstObject'));
          this.get('previewEmbedTask').perform();
        }
      }
    },

    removeEmbed() {
      const skipped = this.get('skippedEmbeds');
      const embed = this.get('embedUrl');
      skipped.addObject(embed);
      if (isEmpty(this.get('content'))) {
        this.set('embedUrl', undefined);
      }
      invoke(this, 'processLinks', this.get('content'), true);
    }
  }
});
