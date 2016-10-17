import Ember from 'ember';
import { isEmberArray as isArray } from 'ember-array/utils';

export default Ember.Component.extend({

  loading: false,

  didReceiveAttrs() {
    this._super(...arguments);

    if (this.get('similarity') !== undefined) return;

    if (!isArray(this.get('source')) || !isArray(this.get('target'))) {
      this.set('similarity', '?');
      return;
    }

    this.set('loading', true);

    const source = this.get('source');
    const target = this.get('target');
    const similarity = this.calculateSimilarity(source, target);

    this.set('loading', false);
    this.set('similarity', similarity);
  },


  calculateSimilarity(source = [], target = []) {
    const targetList = target.map(x => x.id);
    // eslint-disable-next-line no-param-reassign
    const sourcePool = target.reduce((o, x) => { o[x.id] = x; return o; }, {});
    // eslint-disable-next-line no-param-reassign
    const targetPool = target.reduce((o, x) => { o[x.id] = x; return o; }, {});
    const commonList = [];
    let meanSource = 0;
    let meanTarget = 0;
    let squareDifX = 0;
    let squareDifY = 0;
    let squareDifT = 0;

    source.forEach((item) => {
      if (targetList.indexOf(item.id) !== -1) {
        commonList.push(item.id);
        meanSource += item.rating;
      }
    });

    target.forEach((item) => {
      if (commonList.indexOf(item.id) !== -1) {
        meanTarget += item.rating;
      }
    });

    meanSource /= commonList.length;
    meanTarget /= commonList.length;

    commonList.forEach((id) => {
      const diffX = sourcePool[id].rating - meanSource;
      const diffY = targetPool[id].rating - meanTarget;

      squareDifX += Math.pow(diffX, 2);
      squareDifY += Math.pow(diffY, 2);
      squareDifT += diffX * diffY;
    });

    const similarity = squareDifT / Math.sqrt(squareDifX * squareDifY);

    const ppmccSimilarity = Math.round(similarity * 100);
    const amountSimilarity = (commonList.length / source.length) * 100;

    // Similarity is 20% similar titles and 80% ppmcc match of those
    return ((amountSimilarity * 2) + (ppmccSimilarity * 8)) / 10;
  }
});
