import Controller from '@ember/controller';
import { get } from '@ember/object';
import { inject as service } from '@ember/service';
import { task } from 'ember-concurrency';
import QueryParams from 'ember-parachute';
import errorMessages from 'client/utils/error-messages';

const queryParams = new QueryParams({
  inputEmail: {
    as: 'email',
    defaultValue: null,
    refresh: true
  }
});

export default Controller.extend(queryParams.Mixin, {
  ajax: service(),
  notify: service(),

  /**
   * Tell the server to unsusbcribe the supplied email address.
   */
  unsubscribeEmail: task(function* () {
    try {
      yield get(this, 'ajax').request('/users/_unsubscribe', {
        method: 'POST',
        data: JSON.stringify({ email: get(this, 'email') })
      });
      const message = 'Your email has been unsubscribed!';
      get(this, 'notify').success(message, { closeAfter: 5000 });
      this.transitionToRoute('dashboard');
    } catch (error) {
      get(this, 'notify').error(errorMessages(error));
    }
  }).drop()
});
