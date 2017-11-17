import Component from '@ember/component';

export default Component.extend({
  classNames: ['language-selector'],

  // Videos to choose from
  videos: [],
  selectedVideo: null,
  // Events
  onChange() {}
});
