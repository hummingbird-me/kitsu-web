import ApplicationSerializer from 'client/serializers/application';

export default ApplicationSerializer.extend({
  attrs: {
    rulesFormatted: { serialize: false },
    leadersCount: { serialize: false },
    membersCount: { serialize: false },
    neighborsCount: { serialize: false },
    slug: { serialize: false }
  }
});
