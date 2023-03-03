import React, { ReactElement } from 'react';

import ChosenMedia from 'app/components/QUEmbed/ChosenMedia';
import { MediaDataFragment } from 'app/components/QUEmbed/findMediaByIdAndType-gql';

interface Props {
  record: MediaDataFragment;
  deleteIndexDbRecord: (e) => void;
}

export default function MediaPage({
  record,
  deleteIndexDbRecord,
}: Props): ReactElement {
  return (
    <ChosenMedia record={record} deleteIndexDbRecord={deleteIndexDbRecord} />
  );
}
