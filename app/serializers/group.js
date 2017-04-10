import ApplicationSerializer from 'client/serializers/application';

export default ApplicationSerializer.extend({
  attrs: {
    categoryHack: { serialize: false },
    rulesFormatted: { serialize: false },
    leadersCount: { serialize: false },
    membersCount: { serialize: false },
    neighborsCount: { serialize: false },
    slug: { serialize: false },
    userMembership: { serialize: false }
  }
});
