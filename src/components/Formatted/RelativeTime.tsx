import React from 'react';
import { FormattedMessage } from 'react-intl';
import { formatDistanceToNow, differenceInSeconds } from 'date-fns';
import { useInterval, useUpdate } from 'react-use';

import { useDateFnsLocale } from 'app/contexts/IntlContext';

function intervalFor(time: Date) {
  const diff = Math.abs(differenceInSeconds(new Date(), time));

  if (diff < 30) {
    // Every second until 30 seconds have elapsed
    return 1000 * 1;
  } else if (diff < 90) {
    // Every 5 seconds until 90 seconds have elapsed
    return 1000 * 1;
  } else if (diff < 3600) {
    // Every minute until 1 hour has elapsed
    return 1000 * 60;
  } else if (diff < 86400) {
    // Every hour until 1 day has elapsed
    return 1000 * 60 * 60;
  } else {
    // Every 12 hours past that
    return 1000 * 60 * 60 * 12;
  }
}

const FormattedRelativeTime: React.FC<{ time: Date }> = function ({ time }) {
  const update = useUpdate();
  const locale = useDateFnsLocale();
  useInterval(update, intervalFor(time));

  return (
    <FormattedMessage
      defaultMessage="{time} ago"
      values={{
        time: formatDistanceToNow(time, { addSuffix: true, locale }),
      }}
    />
  );
};

export default FormattedRelativeTime;
