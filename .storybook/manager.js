import { addons } from '@storybook/addons';
import KitsuTheme from './KitsuTheme';

addons.setConfig({
  theme: KitsuTheme,
  sidebar: {
    showRoots: false,
  },
});
