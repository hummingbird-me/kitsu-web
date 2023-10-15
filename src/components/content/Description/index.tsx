import React from 'react';
import { FormattedMessage } from 'react-intl';

import styles from './styles.module.css';

const SOURCE_REGEX = /[([](?:Source:|Written by)\s+([^)]+)\s*[)\]]/i;

type DescriptionProps = {
  text: string;
  className?: string;
};

export function Description({
  text,
  className,
}: DescriptionProps): JSX.Element {
  // @TODO: Clean up the data in the database instead.
  const source = text.match(SOURCE_REGEX)?.[1];
  text = text.replace(SOURCE_REGEX, '');
  text = text.replace(/(\s)+/g, '$1');
  text = text.replace(/\n+/g, '\n');
  text = text.trim();
  const paragraphs = text.split('\n');

  return (
    <div className={[styles.container, className].join(' ')}>
      {paragraphs.map((p, i) => (
        <p key={i}>
          {p}
          {source && i == paragraphs.length - 1 ? (
            <span className={styles.source}>
              <FormattedMessage
                defaultMessage="(Source: {source})"
                values={{ source }}
              />
            </span>
          ) : null}
        </p>
      ))}
    </div>
  );
}
