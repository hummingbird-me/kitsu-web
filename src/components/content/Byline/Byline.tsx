import React from 'react';

import styles from './styles.module.css';

const Byline = {
  Container({
    children,
    className,
  }: {
    children: React.ReactNode;
    className?: string;
  }) {
    return (
      <div className={[styles.Byline, className].join(' ')}>{children}</div>
    );
  },
  Avatar({
    children,
    className,
  }: {
    children: React.ReactNode;
    className?: string;
  }) {
    return (
      <div className={[styles.Avatar, className].join(' ')}>{children}</div>
    );
  },
  Title({
    children,
    className,
  }: {
    children: React.ReactNode;
    className?: string;
  }) {
    return (
      <div className={[styles.Title, className].join(' ')}>{children}</div>
    );
  },
  Subtitle({
    children,
    className,
  }: {
    children: React.ReactNode;
    className?: string;
  }) {
    return (
      <div className={[styles.Subtitle, className].join(' ')}>{children}</div>
    );
  },
  Right({
    children,
    className,
  }: {
    children: React.ReactNode;
    className?: string;
  }) {
    return (
      <div className={[styles.Right, className].join(' ')}>{children}</div>
    );
  },
} as const;

export default Byline;
