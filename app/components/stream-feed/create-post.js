import Component from '@ember/component';
import { inject as service } from '@ember/service';
import { get, set, setProperties, getProperties, computed } from '@ember/object';
import { isEmpty, isPresent } from '@ember/utils';
import { empty, notEmpty, and, or, equal } from '@ember/object/computed';
import { task, timeout } from 'ember-concurrency';
import { invokeAction, invoke } from 'ember-invoke-action';
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
  embedUrl: null,

  ajax: service(),
  store: service(),
  queryCache: service(),
  fileQueue: service(),
  notify: service(),
  raven: service(),

  canPost: or('contentPresent', 'uploadsReady', 'embedUrl'),
  uploadsReady: and('uploadsPresent', 'queueFinished'),
  uploadsPresent: notEmpty('uploads'),
  queueFinished: empty('fileQueue.files'),
  hasMaxUploads: equal('uploads.length', FILE_UPLOAD_LIMIT),

  contentPresent: computed('content', 'embedUrl', function() {
    const hasContent = (isPresent(get(this, 'content'))
      && get(this, 'content.length') <= get(this, 'maxLength'));
    let hasEmbed = isPresent(this.get('embedUrl'));
    if (this.get('isEditing')) {
      hasEmbed = hasEmbed && (this.get('post.embed.url') !== this.get('embedUrl'));
    }
    return hasContent || hasEmbed;
  }).readOnly(),

  uploadCount: computed('fileQueue.files.[]', function() {
    return Math.max(0, Math.min(this.get('fileQueue.files.length'), FILE_UPLOAD_LIMIT));
  }).readOnly(),

  init() {
    this._super(...arguments);
    // copy uploads into our own list
    const uploads = [];
    if (this.get('post.uploads') && this.get('post.uploads.length') > 0) {
      this.get('post.uploads').sortBy('uploadOrder').forEach(upload => uploads.push(upload));
    }
    this.set('uploads', uploads);

    // initialize skipped embeds list
    this.set('skippedEmbeds', []);
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
        embedUrl: get(this, 'post.embed.url')
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

  createPost: task(function* () {
    const options = { ...getProperties(this, 'nsfw', 'spoiler', 'uploads', 'embedUrl') };
    if (this._usableMedia !== null) {
      options.media = this._usableMedia;
    }
    if (get(this, 'shouldUnit') === true && isEmpty(get(this, 'unitNumber')) === false) {
      options.unitNumber = get(this, 'unitNumber');
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
    return yield RSVP.allSettled([anime, manga], 'Search Media').then(states => {
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
      if (this.get('hasMaxUploads') || !isFileValid(get(file, 'blob'), get(this, 'accept'))) {
        set(file, 'state', 'aborted');
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
      failedFiles.forEach(file => {
        set(file, 'state', 'aborted');
      });
    }
  }).enqueue(),

  previewEmbedTask: task(function* () {
    const url = this.get('embedUrl');
    if (!url) { return; }
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

  _resetProperties() {
    if (get(this, 'isEditing') === true) {
      return;
    }

    setProperties(this, {
      content: '',
      isExpanded: false,
      nsfw: false,
      uploads: [],
      skippedEmbeds: [],
      embedUrl: undefined
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
      invoke(this, 'processLinks', this.get('content'));
    },

    // This action is executed everytime the content of the text-area is changed
    processLinks(content, force = false) {
      // reset the skipped embeds if the content is empty (this will be from a deletion)
      if (isEmpty(content) || (!this.get('queueFinished') || this.get('uploads.length') > 0)) {
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
