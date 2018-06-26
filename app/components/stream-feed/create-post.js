import Component from '@ember/component';
import { inject as service } from '@ember/service';
import { get, set, setProperties, getProperties, computed } from '@ember/object';
import { isEmpty, isPresent } from '@ember/utils';
import { empty, notEmpty, and, or, gte } from '@ember/object/computed';
import { task, timeout } from 'ember-concurrency';
import { invokeAction } from 'ember-invoke-action';
import jQuery from 'jquery';
import RSVP from 'rsvp';
import config from 'client/config/environment';
import errorMessages from 'client/utils/error-messages';
import isFileValid from 'client/utils/is-file-valid';

const FILE_UPLOAD_LIMIT = 20;
const LINK_REGEX = /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,4}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/gi;

export default Component.extend({
  classNameBindings: ['isExpanded:is-expanded'],
  classNames: ['stream-add-content'],
  accept: 'image/jpg, image/jpeg, image/png, image/gif',
  content: undefined,
  isExpanded: false,
  isEditing: false,
  mediaReadOnly: false,
  nsfw: false,
  spoiler: false,
  shouldUnit: false,
  maxLength: 9000,
  _usableMedia: null,

  ajax: service(),
  store: service(),
  queryCache: service(),
  fileQueue: service(),
  notify: service(),
  raven: service(),

  canPost: or('contentPresent', 'uploadsReady'),
  uploadsReady: and('uploadsPresent', 'queueFinished'),
  uploadsPresent: notEmpty('uploads'),
  queueFinished: empty('fileQueue.files'),
  hasMaxUploads: gte('uploads.length', FILE_UPLOAD_LIMIT),

  contentPresent: computed('content', function() {
    return isPresent(get(this, 'content'))
      && get(this, 'content.length') <= get(this, 'maxLength');
  }).readOnly(),

  createPost: task(function* () {
    const options = Object.assign({}, getProperties(this, 'nsfw', 'spoiler', 'uploads'));
    if (this._usableMedia !== null) {
      options.media = this._usableMedia;
    }
    if (get(this, 'shouldUnit') === true && isEmpty(get(this, 'unitNumber')) === false) {
      options.unitNumber = get(this, 'unitNumber');
    }
    if (this.get('embeds.length') > 0) {
      options.embedUrl = this.get('embeds.firstObject');
    }
    yield invokeAction(this, 'onCreate', get(this, 'content'), options);
    this._resetProperties();
  }).drop(),

  getMedia: task(function* (type, query) {
    return yield get(this, 'store').query(type, {
      filter: { text: query },
      page: { limit: 4 }
    });
  }).restartable().maxConcurrency(2),

  setUnitNumberTask: task(function* () {
    if (!get(this, 'session.hasUser') || !isEmpty(get(this, 'unitNumber'))) {
      return;
    }
    const media = get(this, '_usableMedia');
    const type = get(media, 'modelType');
    const results = yield get(this, 'queryCache').query('library-entry', {
      filter: {
        user_id: get(this, 'session.account.id'),
        kind: type,
        [`${type}_id`]: get(media, 'id')
      },
      fields: { libraryEntry: 'progress' }
    });
    const progress = get(results, 'firstObject.progress');
    if (progress > 0) {
      setProperties(this, {
        unitNumber: progress,
        shouldUnit: true
      });
    }
  }).restartable(),

  search: task(function* (query) {
    yield timeout(150);
    const anime = get(this, 'getMedia').perform('anime', query);
    const manga = get(this, 'getMedia').perform('manga', query);
    return yield RSVP.allSettled([anime, manga], 'Search Media').then((states) => {
      const fulfilled = states.filter(state => get(state, 'state') === 'fulfilled');
      return fulfilled.map(i => get(i, 'value').toArray()).reduce((a, b) => a.concat(b));
    });
  }).restartable(),

  uploadImagesTask: task(function* (file) {
    const { access_token: accessToken } = get(this, 'session.data.authenticated');
    const headers = {
      accept: 'application/vnd.api+json',
      authorization: `Bearer ${accessToken}`
    };
    try {
      if (this.get('hasMaxUploads')) {
        const queue = get(this, 'fileQueue').find('uploads');
        const files = get(queue, 'files');
        files.removeObject(file);
        return;
      }

      // valid size & type?
      if (!isFileValid(get(file, 'blob'), get(this, 'accept'))) {
        const queue = get(this, 'fileQueue').find('uploads');
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
      const uploads = get(this, 'uploads');
      uploads.addObjects(body.data.map(upload => store.peekRecord('upload', upload.id)));
      this._orderUploads(uploads);
    } catch (error) {
      get(this, 'raven').captureException(error);
      get(this, 'notify').error(errorMessages(error));

      const queue = get(this, 'fileQueue').find('uploads');
      const files = get(queue, 'files');
      const failedFiles = files.filter(file => ['failed', 'timed_out'].indexOf(file.state) !== -1);
      failedFiles.forEach((file) => {
        files.removeObject(file);
      });
    }
  }).maxConcurrency(3).enqueue(),

  previewEmbedTask: task(function* () {
    const url = this.get('embeds.firstObject');
    return yield this.get('ajax').request('/embeds', {
      method: 'POST',
      data: { url }
    });
  }).restartable(),

  /**
   * If the user clicks outside the bounds of this component
   * then set `isExpanded` to false.
   */
  _handleClick(event) {
    const target = get(event, 'target');
    const isChild = jQuery(target).is('.stream-add-content *, .stream-add-content');
    const isDeleted = jQuery(document.body).find(target).length === 0;
    if (isChild === false && isDeleted === false && get(this, 'isDestroyed') === false) {
      // don't collapse if user has text entered
      if (isEmpty(get(this, 'content')) && !get(this, 'isEditing')) {
        set(this, 'isExpanded', false);
      }
    }
  },

  init() {
    this._super(...arguments);
    const uploads = [];
    if (this.get('post.uploads') && this.get('post.uploads.length') > 0) {
      this.get('post.uploads').forEach(upload => uploads.push(upload));
    }
    this.set('uploads', uploads);
    this.set('embeds', []);
  },

  didReceiveAttrs() {
    this._super(...arguments);
    if (get(this, 'forceUnit') === true) {
      set(this, 'shouldUnit', get(this, 'forceUnit'));
    }
    set(this, 'author', get(this, 'session.account'));
    if (get(this, 'isEditing') === true && get(this, 'post')) {
      setProperties(this, {
        _usableMedia: get(this, 'post.media'),
        mediaReadOnly: true,
        content: get(this, 'post.content'),
        contentOriginal: get(this, 'post.content'),
        spoiler: get(this, 'post.spoiler'),
        nsfw: get(this, 'post.nsfw'),
        author: get(this, 'post.user'),
      });
    } else if (get(this, 'media') !== undefined) {
      set(this, '_usableMedia', get(this, 'media'));
      set(this, 'mediaReadOnly', true);
      set(this, 'spoiler', true);
      get(this, 'setUnitNumberTask').perform();
    }
  },

  didInsertElement() {
    this._super(...arguments);
    if (get(this, 'isEditing') === false) {
      jQuery(document.body).on('click.create-post', event => this._handleClick(event));
    }
  },

  willDestroyElement() {
    this._super(...arguments);
    jQuery(document.body).off('click.create-post');
  },

  _resetProperties() {
    if (get(this, 'isEditing') === true) {
      return;
    }

    setProperties(this, {
      content: '',
      isExpanded: false,
      nsfw: false,
      uploads: [],
      embeds: [],
    });
    if (get(this, 'mediaReadOnly') === false) {
      set(this, '_usableMedia', null);
      set(this, 'spoiler', false);
    }
  },

  _orderUploads(uploads) {
    uploads.forEach(item => set(item, 'uploadOrder', uploads.indexOf(item)));
    set(this, 'uploads', uploads);
  },

  actions: {
    createPost(component, event) {
      const { metaKey, ctrlKey } = event;
      if (metaKey === true || ctrlKey === true) {
        get(this, 'createPost').perform();
      }
    },

    toggleExpand() {
      if (get(this, 'readOnly')) {
        get(this, 'session').signUpModal();
      } else if (!get(this, 'isEditing')) {
        this.toggleProperty('isExpanded');
      }
    },

    paste(event) {
      const { items } = event.clipboardData;
      const images = [];
      for (let i = 0; i < items.length; i += 1) {
        const file = items[i].getAsFile();
        if (file && isFileValid(file, get(this, 'accept'))) {
          event.preventDefault();
          images.push(file);
        }
      }
      if (images && images.length > 0) {
        const queue = get(this, 'fileQueue').find('uploads');
        queue._addFiles(images);
      }
    },

    reorderUploads(orderedUploads) {
      this._orderUploads(orderedUploads);
    },

    removeUpload(upload) {
      upload.destroyRecord();
      get(this, 'uploads').removeObject(upload);
    },

    processLinks() {
      const content = this.get('content');
      if (isEmpty(content)) { return; }

      const links = content.match(LINK_REGEX);
      if (links && links.length > 0) {
        const embeds = this.get('embeds');
        const length = embeds.get('length');
        embeds.addObjects(links);

        // remove any links that exist in embeds but not the content
        // could have deleted all text but didn't refresh page so component still
        // considers them valid embeds.
        const dead = embeds.reject(embed => links.includes(embed));
        embeds.removeObjects(dead);
        if (length === 0) {
          this.get('previewEmbedTask').perform();
        }
      }
    },

    removeEmbed() {
      const embeds = this.get('embeds');
      embeds.removeObject(embeds.get('firstObject'));
      this.get('previewEmbedTask').perform();
    }
  }
});
