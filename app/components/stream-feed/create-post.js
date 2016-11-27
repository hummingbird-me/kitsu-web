import Component from 'ember-component';
import service from 'ember-service/inject';
import get from 'ember-metal/get';
import set, { setProperties } from 'ember-metal/set';
import { isEmpty } from 'ember-utils';
import computed from 'ember-computed';
import { task, timeout } from 'ember-concurrency';
import { invokeAction } from 'ember-invoke-action';
import { bind } from 'ember-runloop';
import jQuery from 'jquery';
import RSVP from 'rsvp';

export default Component.extend({
  classNameBindings: ['isExpanded:is-expanded'],
  classNames: ['stream-add-content'],
  content: undefined,
  isExpanded: false,
  isEditing: false,
  mediaReadOnly: false,
  nsfw: false,
  spoiler: false,
  maxLength: 9000,
  author: undefined,

  session: service(),
  store: service(),

  canPost: computed('content', {
    get() {
      return isEmpty(get(this, 'content')) === false && (get(this, 'content.length') <= get(this, 'maxLength'));
    }
  }).readOnly(),

  createPost: task(function* () {
    if (get(this, 'canPost') === false) {
      return;
    }

    const options = {
      nsfw: get(this, 'nsfw'),
      spoiler: get(this, 'spoiler')
    };
    if (get(this, 'media') !== undefined) {
      options.media = get(this, 'media');
    }
    yield invokeAction(this, 'onCreate', get(this, 'content'), options);
    this._resetProperties();
  }).drop(),

  getMedia: task(function* (type, query) {
    return yield get(this, 'store').query(type, {
      filter: { text: query },
      page: { limit: 2 }
    });
  }).restartable().maxConcurrency(2),

  search: task(function* (query) {
    yield timeout(150);
    const anime = get(this, 'getMedia').perform('anime', query);
    const manga = get(this, 'getMedia').perform('manga', query);
    return yield RSVP.allSettled([anime, manga], 'Search Media').then((states) => {
      const fulfilled = states.filter(state => get(state, 'state') === 'fulfilled');
      return fulfilled.map(i => get(i, 'value').toArray()).reduce((a, b) => a.concat(b));
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
      if (isEmpty(get(this, 'content')) === true) {
        set(this, 'isExpanded', false);
      }
    }
  },

  init() {
    this._super(...arguments);
    set(this, 'author', get(this, 'session.account'));
    if (get(this, 'isEditing') === true) {
      setProperties(this, {
        media: get(this, 'post.media'),
        mediaReadOnly: true,
        content: get(this, 'post.content'),
        spoiler: get(this, 'post.spoiler'),
        nsfw: get(this, 'post.nsfw'),
        author: get(this, 'post.user')
      });
    } else if (get(this, 'media') !== undefined) {
      set(this, 'mediaReadOnly', true);
      set(this, 'spoiler', true);
    }
  },

  didInsertElement() {
    this._super(...arguments);
    if (get(this, 'isEditing') === false) {
      const binding = bind(this, '_handleClick');
      set(this, 'clickBinding', binding);
      jQuery(document.body).on('click', binding);
    }
  },

  willDestroyElement() {
    this._super(...arguments);
    if (get(this, 'isEditing') === false) {
      jQuery(document.body).off('click', get(this, 'clickBinding'));
    }
  },

  _resetProperties() {
    if (get(this, 'isEditing') === true) {
      return;
    }

    setProperties(this, {
      content: '',
      isExpanded: false,
      nsfw: false
    });
    if (get(this, 'mediaReadOnly') === false) {
      set(this, 'media', undefined);
      set(this, 'spoiler', false);
    }
  },

  actions: {
    keyDown(value, event) {
      const { keyCode, metaKey, ctrlKey } = event;
      if (keyCode === 13 && (metaKey === true || ctrlKey === true)) {
        get(this, 'createPost').perform();
      }
    }
  }
});
