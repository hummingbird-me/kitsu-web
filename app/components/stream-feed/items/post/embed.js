import Component from '@ember/component';
import { computed } from '@ember/object';
import { htmlSafe } from '@ember/string';

export default Component.extend({
  classNames: ['stream-content-embed'],
  attributeBindings: ['style'],
  shouldRenderVideo: false,

  isVideo: computed('embed.{kind,video}', function() {
    return this.embed.kind && this.embed.kind.includes('video')
      && (typeof this.embed.video === 'object');
  }),

  requiresIFrame: computed('isVideo', 'embed.video.type', function() {
    if (!this.isVideo) { return false; }
    return this.embed.video.type !== 'video/mp4';
  }),

  videoSrc: computed('isVideo', 'embed.{site.name,video.url}', function() {
    if (!this.isVideo) { return null; }
    const { url } = this.embed.video;
    if (this.embed.site.name === 'YouTube') {
      return url.includes('?') ? `${url}&autoplay=1` : `${url}?autoplay=1`;
    }
    return url;
  }),

  style: computed('embed.video.{width,height}', function() {
    const kind = this.get('embed.kind');
    if (kind === 'video' || kind === 'video.other') {
      const video = this.get('embed.video');
      if (!video) { return null; }
      const { width, height } = video;
      return htmlSafe(`padding-bottom: calc(100% * (${height} / ${width}))`);
    }
    return null;
  }).readOnly(),

  orientation: computed('embed.image.{height,width}', function() {
    const kind = this.get('embed.kind');
    if (kind === 'image') {
      return 'landscape';
    }

    const image = this.get('embed.image');
    if (image) {
      const { width, height } = image;
      const ratio = width / height;
      if (ratio > 1.25) {
        return 'landscape';
      }
    }
    return 'portrait';
  }).readOnly(),

  actions: {
    revealVideo() {
      this.set('shouldRenderVideo', true);
    }
  }
});
