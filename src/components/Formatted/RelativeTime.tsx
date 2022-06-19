import React from 'react';
import {
  formatDistanceToNow,
  differenceInSeconds,
  format as formatDate,
  formatDistanceToNowStrict,
} from 'date-fns';
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

const FormattedRelativeTime: React.FC<{ time: Date; strict?: boolean }> =
  function ({ time, strict = false }) {
    const update = useUpdate();
    const locale = useDateFnsLocale();
    useInterval(update, intervalFor(time));

    const formatted = strict
      ? formatDistanceToNowStrict(time, { addSuffix: true, locale })
      : formatDistanceToNow(time, { addSuffix: true, locale });

    return (
      <time dateTime={time.toISOString()} title={formatDate(time, 'PPPp')}>
        {formatted}
      </time>
    );
  };

export default FormattedRelativeTime;
