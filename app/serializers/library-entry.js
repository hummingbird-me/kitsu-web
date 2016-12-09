import ApplicationSerializer from 'client/serializers/application';

export default ApplicationSerializer.extend({
  attrs: {
    review: { serialize: false },
    unit: { serialize: false },
    nextUnit: { serialize: false }
  }
});
