import React, { useRef } from 'react';
import { useIntersection } from 'react-use';

import styles from './styles.module.css';

export type HeaderBackground = 'opaque' | 'transparent';

export default function HeaderBackground({
  background,
  scrollBackground,
  children,
}: {
  background: HeaderBackground;
  scrollBackground: HeaderBackground;
  children: React.ReactNode;
}) {
  // Set up an IntersectionObserver to detect when the user has scrolled
  const intersectionRef = useRef<HTMLDivElement>(null);
  // @ts-ignore useIntersection handles null refs just fine, their typing is just too strict.
  const intersection = useIntersection(intersectionRef, { threshold: 0 });
  const isScrolled = !intersection?.isIntersecting;
  const displayBackground = isScrolled ? scrollBackground : background;

  return (
    <>
      <div className={styles.ScrollMonitor} ref={intersectionRef} />
      <nav className={[styles.Background, styles[displayBackground]].join(' ')}>
        {children}
      </nav>
    </>
  );
}
