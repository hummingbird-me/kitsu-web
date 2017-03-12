import Component from 'ember-component';
import get from 'ember-metal/get';

export default Component.extend({
  didInsertElement() {
    this._super(...arguments);
    const element = document.createElement('script');
    const content = document.createTextNode(`
      Canny('render', {
        basePath: '${get(this, 'path')}',
        boardToken: '${get(this, 'boardToken')}',
        ssoToken: '${get(this, 'token')}',
      });
    `);
    element.appendChild(content);
    get(this, 'element').appendChild(element);
  }
});
