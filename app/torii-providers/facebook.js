import FacebookConnectProvider from 'torii/providers/facebook-connect';

export default FacebookConnectProvider.extend({
  settings() {
    const original = this._super();
    return { ...original, cookie: false, status: false };
  }
});
