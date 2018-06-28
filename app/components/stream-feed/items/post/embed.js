import Component from '@ember/component';
import { computed } from '@ember/object';
import { htmlSafe } from '@ember/string';

export default Component.extend({
  classNames: ['stream-content-embed'],
  attributeBindings: ['style'],

  style: computed('embed.video.{width,height}', function() {
    const kind = this.get('embed.kind');
    if (kind === 'video' || kind === 'video.other') {
      const video = this.get('embed.video');
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
      const siteName = this.get('embed.site.name');
      const video = this.get('embed.video');
      const { type, url } = video;
      const src = `${url}${siteName === 'YouTube' ? '?autoplay=1' : ''}`;
      const attrs = `src=${src} class="embed-video"`;
      let embed;
      if (type === 'video/mp4') {
        embed = `<video controls autoplay ${attrs}></video>`;
      } else {
        embed = `<iframe ${attrs}></iframe>`;
      }
      const element = this.element.querySelector('.embed-video');
      element.outerHTML = embed;
    }
  }
});
