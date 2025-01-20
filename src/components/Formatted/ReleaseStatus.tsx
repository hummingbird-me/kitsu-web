import React from 'react';
import { FormattedMessage } from 'react-intl';

export default function FormattedReleaseStatus({
  releaseStatus,
}: {
  releaseStatus: 'CURRENT' | 'FINISHED' | 'TBA' | 'UNRELEASED' | 'UPCOMING';
}) {
  switch (releaseStatus) {
    case 'CURRENT':
      return <FormattedMessage defaultMessage="Ongoing" />;
    case 'FINISHED':
      return <FormattedMessage defaultMessage="Finished" />;
    case 'TBA':
      return <FormattedMessage defaultMessage="TBA" />;
    case 'UNRELEASED':
      return <FormattedMessage defaultMessage="Unreleased" />;
    case 'UPCOMING':
      return <FormattedMessage defaultMessage="Upcoming" />;
  }
}
