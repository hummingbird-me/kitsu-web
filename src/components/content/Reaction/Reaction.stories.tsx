import { Meta, StoryObj } from '@storybook/react';

import Reaction from './index';

export default {
  title: 'Components/Reaction',
  component: Reaction,
  parameters: {
    layout: 'centered',
    controls: { expanded: true },
    design: {
      type: 'figma',
      url: 'https://www.figma.com/file/7KLXsWEmbIbkNy9CnFA0Ke/Kitsu-Web-V4?node-id=62%3A224',
    },
  },
} satisfies Meta<typeof Reaction>;

export const Unliked = {
  name: 'Unliked',
  args: {
    reaction: {
      id: '1',
      author: {
        id: '52786',
        name: 'マリズ',
        avatarImage: {
          blurhash:
            'nkJj}9jG-oV@s:~pV@k9RjRkSPoeRjayofM|oyjZf6t7t6j[f6WCayxaazWBa#WB',
          views: [
            {
              height: 100,
              width: 100,
              url: 'https://media.kitsu.io/users/avatars/52786/medium.jpeg',
            },
          ],
        },
      },
      media: {
        id: '1',
        slug: 'cory-white-house-de-chou-taihen',
        titles: {
          preferred: 'Cory White House de Chou Taihen',
        },
      },
      reaction: "It's like Kore wa Sou Raven desu but better.",
      createdAt: new Date(2020, 6, 1),
      likes: {
        totalCount: 420,
      },
      hasLiked: false,
    },
  },
} satisfies StoryObj<typeof Reaction>;
