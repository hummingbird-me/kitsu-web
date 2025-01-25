import React from 'react';

import { graphql, readFragment, type FragmentOf } from '@/graphql';
import Tag, { type TagColor } from 'app/components/content/Tag';

export const CategoryTagFragment = graphql(`
  fragment CategoryTagFragment on Category {
    slug
    title
    root {
      slug
    }
  }
`);

const TAG_COLORS: Record<string, TagColor> = {
  dynamic: 'purple',
  themes: 'blue',
  setting: 'yellow',
  'target-demographics': 'green',
  elements: 'red',
};

export type CategoryTagProps = {
  category: FragmentOf<typeof CategoryTagFragment>;
};

export default function CategoryTag(props: CategoryTagProps) {
  const category = readFragment(CategoryTagFragment, props.category);

  return (
    <Tag
      key={category.slug}
      color={category.root ? TAG_COLORS[category.root.slug] : 'grey'}>
      {/* TODO(i18n): Use the correct locale, resolved on the server */}
      {category.title['en']}
    </Tag>
  );
}
