import ApplicationSerializer from 'client/serializers/application';

export default ApplicationSerializer.extend({
  attrs: {
    owner: { serialize: false }
  }
});
