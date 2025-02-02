import React from 'react';
import { FormattedNumber } from 'react-intl';

import Tag from '@/components/content/Tag';

export default function ModerationScoreTag({
  moderationScores,
}: {
  moderationScores?: Record<string, number>;
}) {
  const spamScore =
    moderationScores?.['sagemaker_v1_spamminess'] ??
    moderationScores?.['nyckel_spamminess'];

  const color =
    spamScore === undefined
      ? 'grey'
      : spamScore > 0.9
        ? 'red'
        : spamScore > 0.7
          ? 'yellow'
          : 'green';

  return (
    <Tag color={color}>
      <FormattedNumber value={spamScore} style="percent" /> Spam
    </Tag>
  );
}
