import Route from '@ember/routing/route';
import { get } from '@ember/object';
import { inject as service } from '@ember/service';
import { isEmpty } from '@ember/utils';
import RSVP from 'rsvp';
import errorMessages from 'client/utils/error-messages';

export default Route.extend({
  ajax: service(),
  notify: service(),

  beforeModel({ queryParams }) {
    const { token } = queryParams;
    return new RSVP.Promise((resolve, reject) => {
      get(this, 'ajax').request('/users?filter[self]=true', {
        headers: { Authorization: `Bearer ${token}` }
      }).then(response => resolve(response)).catch(err => reject(err));
    }).then(response => {
      if (isEmpty(get(response, 'data')) === true) {
        get(this, 'notify').error('The token is either invalid or expired.');
        this.transitionTo('dashboard');
      } else {
        const user = get(response, 'data.firstObject');
        return get(this, 'ajax').request(`/users/${get(user, 'id')}`, {
          method: 'PATCH',
          headers: { Authorization: `Bearer ${token}` },
          data: JSON.stringify({
            data: {
              type: 'users',
              id: get(user, 'id'),
              attributes: { confirmed: true }
            }
          }),
          contentType: 'application/vnd.api+json'
        }).then(() => {
          get(this, 'notify').success('You\'ve successfully confirmed your email address!', { closeAfter: 5000 });
          this.transitionTo('dashboard');
        }).catch(err => get(this, 'notify').error(errorMessages(err)));
      }
    }).catch(err => get(this, 'notify').error(errorMessages(err)));
  }
});
