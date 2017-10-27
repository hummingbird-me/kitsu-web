import { moduleForModel, test } from 'ember-qunit';
import testValidations from 'client/tests/helpers/test-validations';

moduleForModel('user', 'Unit | Model | user', {
  // Specify the other units that are required for this test.
  needs: [
    'config:environment',
    'service:session',
    'service:intl',
    'cldr:en',
    'ember-intl@adapter:default',
    'validator:presence',
    'validator:length',
    'validator:format',
    'validator:messages',
    'model:character',
    'model:block',
    'model:favorite',
    'model:follow',
    'model:user-role',
    'model:post',
    'model:profile-link'
  ],

  beforeEach() {
    const service = this.container.lookup('service:intl');
    service.setLocale('en-us');
  }
});

test('model validations', function(assert) {
  const user = this.subject();
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
