import React from 'react';

import CategoryTag, {
  CategoryTagFragment,
} from '@/components/content/CategoryTag';
import { graphql } from '@/graphql';

import styles from './styles.module.css';

export const CategoryListFragment = graphql(
  `
    fragment CategoryListFragment on Media {
      categories(first: 50, sort: [{ on: ANCESTRY, direction: ASCENDING }]) {
        nodes {
          ...CategoryTagFragment
        }
      }
    }
  `,
  [CategoryTagFragment],
);

const CategoryList: React.FC<{
  categories: (typeof CategoryListFragment)['categories'];
}> = function ({ categories }) {
  return (
    <div className={styles.tagList}>
      {categories?.nodes?.map(
        (category) =>
          category && (
            <CategoryTag key={category.slug} category={category}>
              {category.title['en']}
            </CategoryTag>
          ),
      )}
    </div>
  );
};

export default CategoryList;
