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
const INDICES = {
  users: ['id', 'slug', 'name', 'avatar'],
};

export default Component.extend({
  classNames: ['comment-box'],
  content: null,
  upload: undefined,
  embedUrl: undefined,
  accept: 'image/jpg, image/jpeg, image/png, image/gif',
  dropzoneDisabled: notEmpty('upload'),
  isUserSearchOpen: false,
  previousUserSearchTimeoutId: null,
  previousContent: null,
  currentlyEdtitingUserTag: null,
  users: [],

  ajax: service(),
  notify: service(),
  store: service(),
  fileQueue: service(),
  raven: service(),
  algolia: service(),

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

  usersTask: task(function* (query, options = {}) {
    const index = yield get(this, 'algolia.getIndex').perform('users');
    if (isEmpty(index)) {
      return {};
    }
    return yield index.search(query, {
      attributesToRetrieve: INDICES.users,
      hitsPerPage: 4,
      queryLanguages: ['en', 'ja'],
      naturalLanguages: ['en', 'ja'],
      attributesToHighlight: [],
      responseFields: ['hits', 'hitsPerPage', 'nbHits', 'nbPages', 'offset', 'page'],
      removeStopWords: false,
      removeWordsIfNoResults: 'allOptional',
      ...options
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
    },

    autocompleteUserTag(selectedTag, elementId) {
      const currentlyEditingUserTag = this.get('currentlyEdtitingUserTag')
      const textarea = document.getElementById(elementId)

      const newContent =
        this.content.substring(0, currentlyEditingUserTag.index) +
        '@' +
        this.content.substring(currentlyEditingUserTag.index).replace(currentlyEditingUserTag.tag, selectedTag)

      this.set('isUserSearchOpen', false)
      textarea.value = newContent
      textarea.selectionEnd = newContent.indexOf(' ', currentlyEditingUserTag.index)
      this.set('previousContent', newContent);
    },

    autocompleteUserTagOnTab(_, event) {
      const elementId = event.target.id
      const textarea = event.target

      if (this.get('currentlyEdtitingUserTag') !== null) event.preventDefault();

      const user = this.get('users').at(0)
      if (user === undefined) {
        textarea.value = textarea.value + ' '
        this.set('previousContent', textarea.value);
        return
      }

      const selectedTag = user.tag
      this.send("autocompleteUserTag", selectedTag, elementId)
    },

    closeUserTagSearch() {
      this.set('isUserSearchOpen', false)
    },

    userTagSearch(content) {
      const stringDiffIndex = (s1, s2) => {
        let i = 0;
        while (s1[i] === s2[i] && i <= Math.max(s1.length, s2.length)) i++;
        return i
      }

      const previousContent = this.get('previousContent')

      if (previousContent) {
        const index = stringDiffIndex(previousContent, content)
        const didTypeWhiteSpace = [' ', '\n'].includes(content.at(index)) && content.length > previousContent.length

        if (!didTypeWhiteSpace) {
          const tagRegex = /(@[a-zA-Z])\w+/g
          const tagMatches = content.matchAll(tagRegex)

          // Assume no tag is being edited each keystroke
          this.set('currentlyEdtitingUserTag', null)

          for (const tagMatch of tagMatches) {
            const tag = tagMatch[0]
            const isEditingBeforeTagEnd = tagMatch.index + tag.length >= index
            const isEditingAfterTagStart = index > tagMatch.index
            const isEditingThisTag = isEditingAfterTagStart && isEditingBeforeTagEnd

            if (isEditingThisTag) {
              this.set('currentlyEdtitingUserTag', {
                tag,
                index: tagMatch.index
              })

              const query = tag.substring(1)

              this.usersTask.perform(query).then(response => {
                const records = get(response, 'hits') || [];
                const users = records.map(record => ({
                  name: record.name,
                  tag: record.slug ?? record.id,
                  avatar: record.avatar?.tiny,
                }))
                set(this, 'users', users);
                set(this, 'isUserSearchOpen', true);

                if (this.get('previousUserSearchTimeoutId') !== null) clearTimeout(this.get('previousUserSearchTimeoutId'))
                this.set('previousUserSearchTimeoutId', setTimeout(() => {
                  this.set('isUserSearchOpen', false);
                }, 5000));
              }).catch(error => {
                get(this, 'raven').captureException(error);
              });
            }
          }
        }
      }

      const didEditTag = this.get('currentlyEdtitingUserTag') !== null
      if (!didEditTag) this.set('isUserSearchOpen', false);
      this.set('previousContent', content);
    }
  }
});
