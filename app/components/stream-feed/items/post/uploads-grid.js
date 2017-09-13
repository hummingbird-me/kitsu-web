import Component from 'ember-component';
import get, { getProperties } from 'ember-metal/get';
import set, { setProperties } from 'ember-metal/set';
import computed from 'ember-computed';
import { all, task } from 'ember-concurrency';
import request from 'ember-ajax/request';
import { imgixUrl } from 'client/helpers/imgix-url';

const orientation = (upload) => {
  const { w, h } = getProperties(upload, 'w', 'h');
  const ratio = w / h;
  if (ratio > 1.25) { return 1; }
  if (ratio < 0.75) { return 2; }
  return 0;
};

const avgOrientation = (uploads, length) => {
  if (length === 5) {
    return 'landscape';
  }
  let o = 1;
  const os = uploads.map(upload => orientation(upload));
  switch (length) {
    case 2: o = os[0] === os[1] ? os[0] : 0; break;
    case 3: {
      const landscapeFreq = os.filter(o => o === 1).length;
      const portraitFreq = os.filter(o => o === 2).length;
      o = landscapeFreq > portraitFreq ? 1 : 2;
      break;
    }
    case 4: o = os[0]; break;
    default:
  }
  let avgOrientation;
  switch (o) {
    case 0: avgOrientation = 'square'; break;
    case 1: avgOrientation = 'landscape'; break;
    case 2: avgOrientation = 'portrait'; break;
    default:
  }
  return avgOrientation;
};

const thumbSize = (length, orientation, index) => {
  const max = 538;
  const margin = 4;
  if (orientation === 'square') {
    const box = (max - 4) / 2;
    return { width: box, height: box };
  }
  let long;
  let short;
  switch (length) {
    case 1:
      long = max;
      short = max;
      break;
    case 2:
      long = max;
      short = (max - margin) / 2;
      break;
    case 3:
      if (index === 0) {
        long = max;
        short = (max - margin) * (2 / 3);
      } else {
        long = (max - margin) / 2;
        short = (max - margin) / 3;
      }
      break;
    case 4:
      if (index === 0) {
        long = max;
        short = (max - margin) * (2 / 3);
      } else {
        long = (max - (2 * margin)) / 3;
        short = (max - margin) / 3;
      }
      break;
    case 5:
      if (index < 2) {
        long = (max - margin) / 2;
        short = ((max * 0.83) - margin) * (3 / 5);
      } else {
        long = (max - (2 * margin)) / 3;
        short = ((max * 0.83) - margin) * (2 / 5);
      }
      break;
    default:
  }
  if (orientation === 'landscape') {
    return { width: long, height: short };
  }
  return { width: short, height: long };
};

export default Component.extend({
  classNames: ['stream-content-post-uploads-container'],
  classNameBindings: ['gridStyle'],
  uploads: [],
  galleryItems: [],

  gridStyle: computed('gridLength', 'gridOrientation', function() {
    return `photo-grid-${get(this, 'gridLength')} ${get(this, 'gridOrientation')}`;
  }).readOnly(),

  didReceiveAttrs() {
    this._super(...arguments);
    get(this, 'getGalleryItemsTask').perform().then((galleryItems) => {
      const length = get(galleryItems, 'length');
      const gridLength = length < 5 ? length : 5;
      const gridOrientation = avgOrientation(galleryItems, gridLength);
      galleryItems.forEach((item, index) => {
        const { width: w, height: h } = thumbSize(gridLength, gridOrientation, index);
        let thumbSrc;
        if (length === 1) {
          thumbSrc = imgixUrl([item.src, { h }]);
        } else {
          thumbSrc = imgixUrl([item.src, { w, h, fit: 'crop' }]);
        }
        set(item, 'thumbSrc', thumbSrc);
      });
      setProperties(this, { galleryItems, gridLength, gridOrientation });
    });
  },

  getGalleryItemsTask: task(function* () {
    const uploads = get(this, 'uploads');
    return yield all(uploads.map((upload) => {
      const src = get(upload, 'content.original');
      const jsonUrl = imgixUrl([src, { fm: 'json' }]);
      console.log(jsonUrl);
      return request(jsonUrl).then(data => ({
        src, w: data.PixelWidth, h: data.PixelHeight
      }));
    }));
  }).drop(),
});
