import { DropdownMenu } from 'radix-ui';
import React from 'react';

import styles from './styles.module.css';

/**
 * These components wrap radix-ui and provide styling and logic for the navbar dropdowns.
 */
export default {
  Root: DropdownMenu.Root,
  Trigger: DropdownMenu.Trigger,
  Link: DropdownMenu.Item,
  Content: ({ children }: { children: React.ReactNode }) => {
    return (
      <DropdownMenu.Portal>
        <DropdownMenu.Content className={styles.MenuContent}>
          {children}
          <DropdownMenu.Arrow className={styles.MenuArrow} />
        </DropdownMenu.Content>
      </DropdownMenu.Portal>
    );
  },
};
