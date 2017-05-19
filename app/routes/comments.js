import Route from 'ember-route';
import get from 'ember-metal/get';
import set from 'ember-metal/set';
import service from 'ember-service/inject';
import DataErrorMixin from 'client/mixins/routes/data-error';

export default Route.extend(DataErrorMixin, {
  intl: service(),

  model({ id }) {
    return get(this, 'store').findRecord('comment', id, {
      include: 'user,parent,post,post.user,post.targetUser,post.targetGroup,post.media',
      reload: true
    });
  },

  afterModel(model) {
    set(this, 'breadcrumb', `Comment by ${get(model, 'user.name')}`);
    const tags = this.setHeadTags(model);
    set(this, 'headTags', tags);
  },

  setupController(controller, model) {
    this._super(...arguments);
    const postId = get(model, 'post.id');
    const parentId = get(model, 'parent.id');
    set(controller, 'post', get(this, 'store').peekRecord('post', postId));
    set(controller, 'parent', get(this, 'store').peekRecord('comment', parentId));
  },

  titleToken(model) {
    const commenter = get(model, 'user.name');
    return get(this, 'intl').t('titles.comments', { user: commenter });
  },

  setHeadTags(model) {
    const description = get(model, 'content').substring(0, 140);
    const tags = [{
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
    }];

    // If the comment has likes, add extra data (Slack uses this for example)
    if (get(model, 'likesCount')) {
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
          content: get(model, 'likesCount')
        }
      });
    }

    // Push replies count if any exist
    if (get(model, 'repliesCount')) {
      tags.push({
        type: 'meta',
        tagId: 'meta-twitter-label2',
        attrs: {
          property: 'twitter:label2',
          content: 'Replies'
        }
      }, {
        type: 'meta',
        tagId: 'meta-twitter-data2',
        attrs: {
          property: 'twitter:data2',
          content: get(model, 'repliesCount')
        }
      });
    }

    return tags;
  }
});
