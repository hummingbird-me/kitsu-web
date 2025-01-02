import { addons } from '@storybook/manager-api';

import KitsuTheme from './KitsuTheme';

addons.setConfig({
  theme: KitsuTheme,
  sidebar: {
    showRoots: true,
  },
});
