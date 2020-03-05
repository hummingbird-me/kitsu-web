import { computed, get } from '@ember/object';
import { inject as service } from '@ember/service';
import ApolloService from 'ember-apollo-client/services/apollo';
import { setContext } from 'apollo-link-context';

export default ApolloService.extend({
  session: service(),

  link: computed('session.token', function() {
    const httpLink = this._super(...arguments);

    const token = get(this, 'session.token');

    const authLink = setContext(() => {
      if (!token) return {};

      return { headers: { Authorization: `Bearer ${token}` } };
    });

    return authLink.concat(httpLink);
  })
});
