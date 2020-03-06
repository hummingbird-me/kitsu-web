import humanizeDuration from 'client/utils/humanize-duration';
import { module, test } from 'qunit';
import moment from 'moment';

module('Unit | Utility | humanize duration', function() {
  test('it works', function(assert) {
    const duration = moment.duration().add(34560, 'seconds');
    const result = humanizeDuration(duration);
    assert.equal(result, '9 hours, 36 minutes', 'returned correct duration');
  });
});
