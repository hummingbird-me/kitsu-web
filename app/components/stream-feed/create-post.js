import Component from 'ember-component';
import service from 'ember-service/inject';
import get, { getProperties } from 'ember-metal/get';
import set, { setProperties } from 'ember-metal/set';
import { isEmpty, isPresent } from 'ember-utils';
import computed, { empty, notEmpty, and, or } from 'ember-computed';
import { all, task, timeout } from 'ember-concurrency';
import { invokeAction } from 'ember-invoke-action';
import jQuery from 'jquery';
import RSVP from 'rsvp';
import config from 'client/config/environment';
import errorMessages from 'client/utils/error-messages';

export default Component.extend({
  classNameBindings: ['isExpanded:is-expanded'],
  classNames: ['stream-add-content'],
  content: undefined,
  isExpanded: false,
  isEditing: false,
  mediaReadOnly: false,
  nsfw: false,
  spoiler: false,
  shouldUnit: false,
  maxLength: 9000,
  uploads: [],
  _usableMedia: null,
  store: service(),
  queryCache: service(),
  fileQueue: service(),

  canPost: or('contentPresent', 'uploadsReady'),
  uploadsReady: and('uploadsPresent', 'queueFinished'),
  uploadsPresent: notEmpty('uploads'),
  queueFinished: empty('fileQueue.files'),

  contentPresent: computed('content', function() {
    return isPresent(get(this, 'content')) &&
      get(this, 'content.length') <= get(this, 'maxLength');
  }).readOnly(),

  createPost: task(function* () {
    const options = getProperties(this, 'nsfw', 'spoiler', 'uploads');
    if (this._usableMedia !== null) {
      options.media = this._usableMedia;
    }
    if (get(this, 'shouldUnit') === true && isEmpty(get(this, 'unitNumber')) === false) {
      options.unitNumber = get(this, 'unitNumber');
    }
    yield invokeAction(this, 'onCreate', get(this, 'content'), options);
    yield all(options.uploads.filterBy('hasDirtyAttributes').map(upload => upload.save()));
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

  uploadImages: task(function* (file) {
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
      const uploads = get(this, 'uploads');
      uploads.addObjects(body.data.map(upload => store.peekRecord('upload', upload.id)));
      this._orderUploads(uploads);
    } catch (error) {
      get(this, 'notify').error(errorMessages(error));
    }
  }).maxConcurrency(3).enqueue(),

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
        author: get(this, 'post.user')
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
      uploads: []
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

    reorderUploads(orderedUploads) {
      this._orderUploads(orderedUploads);
    },

    removeUpload(upload) {
      get(this, 'uploads').removeObject(upload);
    },
  }
});
