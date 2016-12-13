import ApplicationSerializer from 'client/serializers/application';

export default ApplicationSerializer.extend({
  attrs: {
    contentFormatted: { serialize: false },
    progress: { serialize: false },
    rating: { serialize: false },
    likesCount: { serialize: false }
  }
});
