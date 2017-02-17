/* eslint-env node */
const path = require('path');

/**
 * As Tether.js is brought in by ember-tether, we want bootstrap to be added after that fact
 * as it depends on it existing before it is executed.
 */
module.exports = {
  name: 'bootstrap-v4',

  treeForVendor() {
    const Funnel = require('broccoli-funnel'); // eslint-disable-line
    const bootstrapPath = path.dirname(require.resolve('bootstrap'));
    return new Funnel(this.treeGenerator(bootstrapPath), {
      destDir: 'bootstrap'
    });
  },

  included(app) {
    this._super.included.apply(this, arguments);
    const bootstrapPath = path.join('vendor/bootstrap');
    app.import(path.join(bootstrapPath, 'bootstrap.js'));
  },

  isDevelopingAddon() {
    return true;
  }
};
