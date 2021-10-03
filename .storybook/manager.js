import { addons } from '@storybook/addons';
import KitsuTheme from './KitsuTheme';
import '@storybook/addon-console';

addons.setConfig({
  theme: KitsuTheme,
  sidebar: {
    showRoots: false,
  },
});
