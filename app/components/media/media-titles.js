import Component from 'ember-component';
import computed from 'ember-computed';
import get from 'ember-metal/get';

export default Component.extend({
  tagName: 'section',
  classNames: ['media--alt-titles'],

  titles: computed('media.titles', function() {
    const titles = get(this, 'media.titles');
    // If `en` and `en_jp` match, then we only want to show one
    const { en, en_jp: jp } = titles;
    if (en === jp) {
      delete titles.en_jp;
    }
    return titles;
  }).readOnly(),

  // Can be removed once duplications are fixed on API side
  abbreviatedTitles: computed('media.abbreviatedTitles', function() {
    const titles = [];
    get(this, 'media.abbreviatedTitles').forEach((title) => {
      titles.addObject(title);
    });
    return titles;
  }).readOnly()
});
