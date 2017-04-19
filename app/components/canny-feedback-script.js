import Component from 'ember-component';
import get from 'ember-metal/get';

export default Component.extend({
  didInsertElement() {
    this._super(...arguments);
    this._createCannyElement();
  },

  _createCannyElement() {
    const element = document.createElement('script');
    const content = document.createTextNode(`
      Canny('render', ${JSON.stringify(this._cannyObject())});
    `);
    element.appendChild(content);
    get(this, 'element').appendChild(element);
  },

  _cannyObject() {
    const baseObject = {
      basePath: get(this, 'path'),
      boardToken: get(this, 'boardToken')
    };
    if (get(this, 'session.hasUser')) {
      baseObject.ssoToken = get(this, 'token');
    }
    return baseObject;
  }
});
