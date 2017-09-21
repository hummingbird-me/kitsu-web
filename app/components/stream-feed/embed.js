import Component from 'ember-component';
import get, { getProperties } from 'ember-metal/get';
import computed from 'ember-computed';
import { htmlSafe } from 'ember-string';

export default Component.extend({
  classNames: ['stream-content-embed'],
  attributeBindings: ['style'],

  style: computed('embed.video.height', 'embed.video.width', function() {
    const kind = get(this, 'embed.kind');
    if (kind === 'video' || kind === 'video.other') {
      const video = get(this, 'embed.video');
      const { width, height } = getProperties(video, 'width', 'height');
      return htmlSafe(`padding-bottom: calc(100% * (${height} / ${width}))`);
    }
    return null;
  }).readOnly(),

  orientation: computed('embed.image.height', 'embed.image.width', function() {
    const image = get(this, 'embed.image');
    if (image) {
      const { width, height } = getProperties(image, 'width', 'height');
      const ratio = width / height;
      if (ratio > 1.25) {
        return 'landscape';
      }
    }
    return 'portrait';
  }).readOnly(),

  actions: {
    reveal() {
      const siteName = get(this, 'embed.site_name');
      const video = get(this, 'embed.video');
      const { type, url } = getProperties(video, 'type', 'url');
      const src = `${url}${siteName === 'YouTube' ? '?autoplay=1' : ''}`;
      const attrs = `src=${src} class="embed-video"`;
      let embed;
      if (type === 'video/mp4') {
        embed = `<video controls autoplay ${attrs}></video`;
      } else {
        embed = `<iframe ${attrs}></iframe>`;
      }
      this.$('.embed-preview').replaceWith(embed);
    }
  }
});
