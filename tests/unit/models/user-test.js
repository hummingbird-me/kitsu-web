import { module, test } from 'qunit';
import { setupTest } from 'ember-qunit';
import testValidations from 'client/tests/helpers/test-validations';

import { run } from '@ember/runloop';

module('Unit | Model | user', function(hooks) {
  setupTest(hooks);

  hooks.beforeEach(function() {
    const service = this.owner.lookup('service:intl');
    service.setLocale('en-us');
  });

  test('model validations', function(assert) {
    const user = run(() => this.owner.lookup('service:store').createRecord('user'));
    const valid = {
      name: ['Okabe', '123 Okabe', 'Josh is a 💩', '岡部 倫太郎', 'Okabe Rintarō'],
      slug: ['Okabe', '123Okabe', null, undefined],
      email: ['a@b.com', 'email+ignore@host.tld'],
      password: ['password']
    };

    const invalid = {
      name: ['ab', 'abcdeabcdeabcdeabcdeabcdeabcdeabcdeabcde', null, undefined],
      slug: ['ab', '12345', '_okabe', 'asdadasdasdasdasdadadasd'],
      email: ['abc', 'abc@a', 'abc@abc.', '', null, undefined],
      password: ['not8', '', null, undefined]
    };

    testValidations(user, valid, invalid, assert);
  });
});
