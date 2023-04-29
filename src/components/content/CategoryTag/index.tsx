import React from 'react';

import Tag, { TagColor } from 'app/components/content/Tag';

import { CategoryTagFieldsFragment } from './categoryTagFields-gql';

function tagColorForRoot(root?: string): TagColor {
  switch (root) {
    case 'dynamic':
      return TagColor.PURPLE;
    case 'themes':
      return TagColor.BLUE;
    case 'setting':
      return TagColor.YELLOW;
    case 'target-demographics':
      return TagColor.GREEN;
    case 'elements':
      return TagColor.RED;
    default:
      return TagColor.GREY;
  }
}

const CategoryTag: React.FC<{ category: CategoryTagFieldsFragment }> =
  function ({ category }) {
    return (
      <Tag key={category.slug} color={tagColorForRoot(category.root?.slug)}>
        {/* TODO(i18n): Use the correct locale, resolved on the server */}
        {category.title['en']}
      </Tag>
    );
  };

export default CategoryTag;
