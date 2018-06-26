import Route from '@ember/routing/route';
import { get, set } from '@ember/object';
import { inject as service } from '@ember/service';
import DataErrorMixin from 'client/mixins/routes/data-error';

export default Route.extend(DataErrorMixin, {
  intl: service(),
  metrics: service(),

  model({ id }) {
    return get(this, 'store').findRecord('post', id, {
      include: 'user,targetUser,targetGroup,media,uploads',
      reload: true
    });
  },

  afterModel(model) {
    set(this, 'breadcrumb', `Post by ${get(model, 'user.name')}`);
    const tags = this.setHeadTags(model);
    set(this, 'headTags', tags);
    get(this, 'metrics').invoke('trackImpression', 'Stream', {
      content_list: [`Post:${get(model, 'id')}`],
      location: get(this, 'routeName')
    });
  },

  titleToken() {
    const model = this.modelFor('posts');
    const name = get(model, 'user.name');
    return get(this, 'intl').t('titles.posts', { user: name });
  },

  setHeadTags(model) {
    const tags = [];
    const content = get(model, 'content');
    if (content) {
      const description = content.substring(0, 140);
      tags.push({
        type: 'meta',
        tagId: 'meta-description',
        attrs: {
          name: 'description',
          content: description
        }
      }, {
        type: 'meta',
        tagId: 'meta-og-description',
        attrs: {
          name: 'og:description',
          content: description
        }
      }, {
        type: 'meta',
        tagId: 'meta-og-image',
        attrs: {
          name: 'og:image',
          content: get(model, 'user.avatar.medium') || get(model, 'user.avatar')
        }
      });
    }

    // If the post has likes, add extra data (Slack uses this for example)
    if (get(model, 'postLikesCount')) {
      tags.push({
        type: 'meta',
        tagId: 'meta-twitter-label1',
        attrs: {
          property: 'twitter:label1',
          content: 'Likes'
        }
      }, {
        type: 'meta',
        tagId: 'meta-twitter-data1',
        attrs: {
          property: 'twitter:data1',
          content: get(model, 'postLikesCount')
        }
      });
    }

    // Push comments count if any exist
    if (get(model, 'commentsCount')) {
      tags.push({
        type: 'meta',
        tagId: 'meta-twitter-label2',
        attrs: {
          property: 'twitter:label2',
          content: 'Comments'
        }
      }, {
        type: 'meta',
        tagId: 'meta-twitter-data2',
        attrs: {
          property: 'twitter:data2',
          content: get(model, 'commentsCount')
        }
      });
    }

    return tags;
  }
});
