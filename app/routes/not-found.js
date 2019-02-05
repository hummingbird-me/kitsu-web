import Route from '@ember/routing/route';

export default Route.extend({
  // This results in redirecting to `/404` if that isn't the current URL.
  redirect() {
    if (window.location.pathname !== '/404') {
      this.replaceWith('/404');
    }
  },

  headTags() {
    return [{
      type: 'meta',
      tagId: 'meta-prerender-status',
      attrs: {
        name: 'prerender-status-code',
        content: '404'
      }
    }];
  }
});
