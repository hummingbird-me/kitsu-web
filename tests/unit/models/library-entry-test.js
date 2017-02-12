import { moduleForModel, test } from 'ember-qunit';
import testValidations from 'client/tests/helpers/test-validations';

moduleForModel('library-entry', 'Unit | Model | library-entry', {
  // Specify the other units that are required for this test.
  needs: [
    'config:environment',
    'validator:presence',
    'validator:number',
    'validator:messages',
    'model:anime',
    'model:manga',
    'model:user',
    'model:review',
    'model:-base'
  ]
});

test('model validations', function(assert) {
  const entry = this.subject();
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
