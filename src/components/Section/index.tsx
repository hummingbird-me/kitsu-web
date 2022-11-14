import React, { HTMLProps } from 'react';
import { FaChevronRight } from 'react-icons/fa';
import { Link, LinkProps } from 'react-router-dom';

import styles from './styles.module.css';

const Section: React.FC<
  {
    title: string;
    link?: string;
    linkTo?: LinkProps['to'];
  } & HTMLProps<HTMLDivElement>
> = function ({ title, link, linkTo, ...props }) {
  return (
    <section className={styles.container}>
      <header className={styles.header}>
        <h1 className={styles.title}>{title}</h1>
        {link && linkTo && (
          <Link className={styles.link} to={linkTo}>
            {link}
            <FaChevronRight size="0.9em" />
          </Link>
        )}
      </header>
      <div className={styles.content} {...props} />
    </section>
  );
};

export default Section;
