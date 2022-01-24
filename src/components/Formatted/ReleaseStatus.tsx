import React from 'react';
import { FormattedMessage } from 'react-intl';

import { ReleaseStatusEnum } from 'app/graphql/types';

export default function FormattedReleaseStatus({
  releaseStatus,
}: {
  releaseStatus: ReleaseStatusEnum;
}): JSX.Element {
  switch (releaseStatus) {
    case ReleaseStatusEnum.Current:
      return <FormattedMessage defaultMessage="Ongoing" />;
    case ReleaseStatusEnum.Finished:
      return <FormattedMessage defaultMessage="Finished" />;
    case ReleaseStatusEnum.Tba:
      return <FormattedMessage defaultMessage="TBA" />;
    case ReleaseStatusEnum.Unreleased:
      return <FormattedMessage defaultMessage="Unreleased" />;
    case ReleaseStatusEnum.Upcoming:
      return <FormattedMessage defaultMessage="Upcoming" />;
  }
}
