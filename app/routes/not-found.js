import Route from '@ember/routing/route';

export default Route.extend({
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
