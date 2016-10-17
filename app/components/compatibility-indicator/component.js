import Ember from 'ember';
import libraryStatus from 'client/utils/library-status';
import { isEmberArray as isArray } from 'ember-array/utils';

export default Ember.Component.extend({

  loading: false,

  didReceiveAttrs() {
    this._super(...arguments);

    if (this.get('similarity') !== undefined) return;

    // DEVNOTE: It is unclear, how data will get into this component
    // The following calculations assumes library-entry objects with
    // the keys id, status and rating.
          this.set('source', [
            {id: 1, status: 'watching', rating: 3},
            {id: 2, status: 'watching', rating: 2},
            {id: 3, status: 'watching', rating: 5},
            {id: 4, status: 'planned', rating: 8},
            {id: 5, status: 'dropped', rating: 8}
          ]);
          this.set('target', [
            {id: 1, status: 'watching', rating: 3},
            {id: 2, status: 'watching', rating: 10},
            {id: 3, status: 'watching', rating: 5},
            {id: 4, status: 'planned', rating: 8},
            {id: 5, status: 'dropped', rating: 8}
          ]);

    if (!isArray(this.get('source')) || !isArray(this.get('target'))) {
      this.set('similarity', 0);
      return;
    }

    this.set('loading', true);

    let source = this.get('source');
    let target = this.get('target');
    let similarity = this.calculateSimilarity(source, target);

    this.set('loading', false);
    this.set('similarity', similarity);
  },


  calculateSimilarity(source = [], target = []) {
    let targetList = target.map(x => x.id);
    let sourcePool = target.reduce((o, x) => {o[x.id] = x; return o;}, {});
    let targetPool = target.reduce((o, x) => {o[x.id] = x; return o;}, {});
    let commonList = [];
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
      let s = sourcePool[id];
      let t = targetPool[id];

      let diffX = s.rating - meanSource;
      let diffY = t.rating - meanTarget;

      squareDifX += Math.pow(diffX, 2);
      squareDifY += Math.pow(diffY, 2);
      squareDifT += diffX * diffY;
    });

    let similarity = squareDifT / Math.sqrt(squareDifX * squareDifY);

    let ppmccSimilarity = Math.round(similarity * 100);
    let amountSimilarity = (commonList.length / source.length) * 100;

    // Similarity is 20% similar titles and 80% ppmcc match of those
    return ((amountSimilarity * 2) + (ppmccSimilarity * 8)) / 10;
  }
});
