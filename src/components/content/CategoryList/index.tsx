import React from 'react';

import CategoryTag, {
  CategoryTagFragment,
} from '@/components/content/CategoryTag';
import { graphql, readFragment, type FragmentOf } from '@/graphql';

import styles from './styles.module.css';

export const CategoryListFragment = graphql(
  `
    fragment CategoryListFragment on Media {
      categories(first: 50, sort: [{ on: ANCESTRY, direction: ASCENDING }]) {
        nodes {
          slug
          ...CategoryTagFragment
        }
      }
    }
  `,
  [CategoryTagFragment],
);

export type CategoryListProps = {
  media: FragmentOf<typeof CategoryListFragment>;
};

export default function CategoryList(props: CategoryListProps) {
  const { categories } = readFragment(CategoryListFragment, props.media);
  return (
    <div className={styles.tagList}>
      {categories?.nodes?.map(
        (category) =>
          category && <CategoryTag key={category.slug} category={category} />,
      )}
    </div>
  );
}
