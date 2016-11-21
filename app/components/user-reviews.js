import Component from 'ember-component';

const MediaReviewsComponent = Component.extend({
  classNames: ['media-list'],
  tagName: 'ul'
});

MediaReviewsComponent.reopenClass({
  positionalParams: ['reviews']
});

export default MediaReviewsComponent;
