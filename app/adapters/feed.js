import ApplicationAdapter from 'client/adapters/application';
import get from 'ember-metal/get';
import { isPresent } from 'ember-utils';

export default ApplicationAdapter.extend({
  urlForQuery(query) {
    const { type, id } = query;
    delete query.type; // eslint-disable-line no-param-reassign
    delete query.id; // eslint-disable-line no-param-reassign
    const url = `${get(this, 'namespace')}/feeds/${type}`;
    if (isPresent(id)) {
      return `${url}/${id}`;
    }
    return url;
  }
});
