import { addons } from '@storybook/addons';
import KitsuTheme from './KitsuTheme';
import '@storybook/addon-console';
import 'storybook-addon-locale/register';

addons.setConfig({
  theme: KitsuTheme,
  sidebar: {
    showRoots: false,
  },
});
