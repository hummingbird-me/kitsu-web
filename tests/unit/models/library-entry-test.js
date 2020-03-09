import { module, test } from 'qunit';
import { setupTest } from 'ember-qunit';
import { setupIntl } from 'ember-intl/test-support';
import testValidations from 'client/tests/helpers/test-validations';

module('Unit | Model | library-entry', function(hooks) {
  setupTest(hooks);
  setupIntl(hooks, 'en-us');

  test('model validations', function(assert) {
    const entry = this.owner.lookup('service:store').createRecord('library-entry');
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
