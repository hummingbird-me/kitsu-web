import { module, test } from 'qunit';
import { setupTest } from 'ember-qunit';
import testValidations from 'client/tests/helpers/test-validations';

import { run } from '@ember/runloop';

module('Unit | Model | library-entry', function(hooks) {
  setupTest(hooks);

  hooks.beforeEach(function() {
    const service = this.owner.lookup('service:intl');
    service.setLocale('en-us');
  });

  test('model validations', function(assert) {
    const entry = run(() => this.owner.lookup('service:store').createRecord('library-entry'));
    const valid = {
      progress: [0, 10, 50],
      reconsumeCount: [0, 10]
    };
    const invalid = {
      progress: ['abc', 1.5, -1],
      reconsumeCount: ['abc', 1.5, -1]
    };

    testValidations(entry, valid, invalid, assert);
  });
});
