import ApplicationSerializer from 'client/serializers/application';

export default ApplicationSerializer.extend({
  attrs: {
    rulesFormatted: { serialize: false },
    membersCount: { serialize: false },
    slug: { serialize: false }
  }
});
