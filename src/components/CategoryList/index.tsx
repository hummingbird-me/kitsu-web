import React from 'react';

import CategoryTag from 'app/components/CategoryTag';

import { CategoryListFieldsFragment } from './categoryListFields-gql';
import styles from './styles.module.css';

const CategoryList: React.FC<{
  categories: CategoryListFieldsFragment['categories'];
}> = function ({ categories }) {
  return (
    <div className={styles.tagList}>
      {categories.nodes?.map(
        (category) =>
          category && (
            <CategoryTag key={category.slug} category={category}>
              {category.title['en']}
            </CategoryTag>
          )
      )}
    </div>
  );
};

export default CategoryList;
