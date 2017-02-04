import Component from 'ember-component';
import set from 'ember-metal/set';
import get from 'ember-metal/get';
import service from 'ember-service/inject';
import observer, { addObserver, removeObserver } from 'ember-metal/observer';
import errorMessages from 'client/utils/error-messages';

export default Component.extend({
  classNames: ['poster-wrapper'],
  entry: null,
  media: undefined,
  trailerOpen: false,
  showTooltip: false,
  isTooltipHovered: false,
  notify: service(),
  session: service(),
  store: service(),

  didInsertElement() {
    this._super(...arguments);
    this.$('.grid-poster').hoverIntent({
      over: () => this._onMouseEnter(),
      out: () => this._onMouseLeave(),
      timeout: 250
    });
  },

  willDestroyElement() {
    this._super(...arguments);
    this.$('.grid-poster').off('mouseenter.hoverIntent');
  },

  /**
   * Called by hoverIntent when the user hovers this component
   */
  _onMouseEnter() {
    // If this is the first time the component is hovered,
    // then load the library entry
    if (!get(this, 'hasHovered')) {
      this._getLibraryEntry();
    }
    // enable the tether tooltip
    set(this, 'showTooltip', true);
  },

  /**
   * Called by hoverIntent when the user's mouse leaves this component
   */
  _onMouseLeave() {
    // We don't want to close the tooltip if the tooltip itself is hovered.
    // The tooltip communicates that to us via the onHover/onLeave actions
    if (get(this, 'isTooltipHovered')) {
      // tooltip is currently hovered, so observe the variable and exit after
      addObserver(this, 'isTooltipHovered', this._onMouseLeave);
    } else {
      removeObserver(this, 'isTooltipHovered', this._onMouseLeave);
      set(this, 'showTooltip', false);
    }
  },

  _getLibraryEntry() {
    // already done a request
    if (get(this, 'entry') !== null || !get(this, 'session.hasUser')) {
      return;
    }

    const media = get(this, 'media');
    const type = get(media, 'modelType');
    const promise = get(this, 'store').query('library-entry', {
      filter: {
        kind: type,
        [`${type}_id`]: get(media, 'id'),
        user_id: get(this, 'session.account.id')
      },
    }).then((results) => {
      if (get(this, 'isDestroying') || get(this, 'isDestroyed')) { return; }
      const entry = get(results, 'firstObject');
      set(this, 'entry', entry);
      if (entry !== undefined) {
        set(this, `entry.${type}`, media);
      }
    });
    set(this, 'entry', promise);
  },

  /**
   * If user authenticates on this page and we have already requested the library entry
   * then re-request it.
   */
  _onAuthentication: observer('session.hasUser', function() {
    if (get(this, 'hasHovered')) {
      this._getLibraryEntry();
    }
  }),

  actions: {
    getLibrary() {
      if (get(this, 'session.hasUser') === true) {
        this._getLibraryEntry();
      }
    },

    createEntry(status) {
      const user = get(this, 'session.account');
      const type = get(this, 'media.modelType');
      const entry = get(this, 'store').createRecord('library-entry', {
        status,
        user,
        [type]: get(this, 'media')
      });
      return entry.save().then(() => set(this, 'entry', entry))
        .catch(err => get(this, 'notify').error(errorMessages(err)));
    },

    updateEntry(status) {
      set(this, 'entry.status', status);
      return get(this, 'entry').save().catch((err) => {
        get(this, 'entry').rollbackAttributes();
        get(this, 'notify').error(errorMessages(err));
      });
    },

    deleteEntry() {
      return get(this, 'entry').destroyRecord().then(() => {
        set(this, 'entry', undefined);
      }).catch((err) => {
        get(this, 'entry').rollbackAttributes();
        get(this, 'notify').error(errorMessages(err));
      });
    }
  }
});
