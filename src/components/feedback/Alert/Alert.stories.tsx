import Alert from './index';

export default {
  title: 'Feedback/Alert',
  component: Alert,

  parameters: {
    layout: 'centered',

    controls: {
      expanded: true,
    },

    design: {
      type: 'figma',
      url: 'https://www.figma.com/file/7KLXsWEmbIbkNy9CnFA0Ke/Kitsu-Web-V4?node-id=480%3A1582',
    },
  },
};

export const Playground = {
  render: Alert.bind({}),
  name: 'Playground',

  parameters: {
    layout: 'centered',
  },

  args: {
    kind: 'info',
    children:
      'Cupcake ipsum dolor. Sit amet marshmallow topping cheesecake muffin. Halvah croissant candy canes bonbon candy. Apple pie jelly beans topping carrot cake danish tart cake cheesecake. Muffin danish chocolate soufflé pastry icing bonbon oat cake. Powder cake jujubes oat cake. Lemon drops tootsie roll marshmallow halvah carrot cake.',
  },
};

export const Dismissable = {
  render: (args) => <Alert {...args} kind="error" />,
  name: 'Dismissable',

  parameters: {
    layout: 'centered',
  },

  argTypes: {
    kind: {
      table: {
        disable: true,
      },
    },
  },

  args: {
    children:
      'Great News! Your anime and manga lists have been imported from MyAnimeList successfully.',
  },
};

export const KindSuccess = {
  render: (args) => <Alert {...args} kind="success" onDismiss={null} />,
  name: 'Kind: Success',

  parameters: {
    layout: 'centered',
  },

  argTypes: {
    kind: {
      table: {
        disable: true,
      },
    },
  },

  args: {
    children:
      'Great News! Your anime and manga lists have been imported from MyAnimeList successfully.',
  },
};

export const KindWarning = {
  render: (args) => <Alert {...args} kind="warning" onDismiss={null} />,
  name: 'Kind: Warning',

  parameters: {
    layout: 'centered',
  },

  argTypes: {
    kind: {
      table: {
        disable: true,
      },
    },
  },

  args: {
    children: (
      <>
        <p>
          Your list has been partially imported from MyAnimeList. The following
          items failed to import:
        </p>
        <ul>
          <li>Boku no Pico</li>
        </ul>
      </>
    ),
  },
};

export const KindError = {
  render: (args) => <Alert {...args} kind="error" onDismiss={null} />,
  name: 'Kind: Error',

  parameters: {
    layout: 'centered',
  },

  argTypes: {
    kind: {
      table: {
        disable: true,
      },
    },
  },

  args: {
    children: 'We were unable to import your list from MyAnimeList.',
  },
};

export const KindInfo = {
  render: (args) => <Alert {...args} kind="info" onDismiss={null} />,
  name: 'Kind: Info',

  parameters: {
    layout: 'centered',
  },

  argTypes: {
    kind: {
      table: {
        disable: true,
      },
    },
  },

  args: {
    children:
      'Hey! Just wanted to let you know that this login process will be changing on October 43rd, 3069',
  },
};
