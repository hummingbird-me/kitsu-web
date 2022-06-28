# Kitsu Styleguide

It's important to keep the code consistent throughout a project. Before you make a Pull Request, please check that you're following these project conventions. If something isn't documented here, please look at existing code as a guideline. You can also request documentation over on [Discord](https://invite.gg/kitsu) or in an issue.

## Components

```sh
components/
│    ComponentName/
│   │   index.ts # re-exports
│   │   ComponentName.tsx
│   │   styles.module.css # styles for any components in this folder
│   │   componentName.gql # API calls for that component
```

Components are re-exported in an index.ts file so that you can import them like `import { ComponentName } from 'components/ComponentName';`

```ts
// index.ts
export { default as ComponentName } from './ComponentName';
```

Declare components like this

```ts
// ComponentName.tsx
const ComponentName = function ({prop1, prop2, children}: { prop1: string, prop2: number, children: ReactNode }) {
  ...
}

export default ComponentName;
```

Type are declared inline rather than in an interface because that gives us a list of properties when hovering over the component anywhere in VSCode. If you need the properties elsewhere, you can use `React.ComponentProps<Component>`

Please do not use the React.FC type as it's [discouraged](https://juhanajauhiainen.com/posts/should-you-use-reactfc-to-type-your-components)

Separate components into separate files. Only re-export components that are supposed to be used elsewhere in the project.
