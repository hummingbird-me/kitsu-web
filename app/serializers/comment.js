import ApplicationSerializer from 'client/serializers/application';

export default ApplicationSerializer.extend({
  attrs: {
    likesCount: { serialize: false },
    repliesCount: { serialize: false },
    createdAt: { serialize: false }
  }
});
