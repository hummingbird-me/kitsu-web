import React from 'react';
import { describe, expect, test } from 'vitest';

import { render, screen } from 'app/test-utils/testing-library';

import { Description } from './index';

describe('with a single paragraph', () => {
  test('renders the paragraph', () => {
    render(<Description text="Test" />);

    expect(screen.getByText('Test')).toBeInTheDocument();
  });
});

describe('with multiple paragraphs', () => {
  test('renders the paragraphs in separate <p> tags', () => {
    render(<Description text={'One\nTwo'} />);

    expect(screen.getByText('One')).not.toEqual(screen.getByText('Two'));
  });

  test('combines runs of newlines in the middle', () => {
    render(<Description text={'One\n\n\n\n\nTwo'} />);

    expect(
      screen.queryByText(/^\s+$/, { selector: 'p' }),
    ).not.toBeInTheDocument();
  });

  test('ignores newlines at the end', () => {
    render(<Description text={'One\n\n\n'} />);

    expect(
      screen.queryByText(/^\s+$/, { selector: 'p' }),
    ).not.toBeInTheDocument();
  });

  test('ignores newlines at the start', () => {
    render(<Description text={'\n\n\nOne'} />);

    expect(
      screen.queryByText(/^\s+$/, { selector: 'p' }),
    ).not.toBeInTheDocument();
  });
});

describe('with a source', () => {
  describe('on the same line in parentheses', () => {
    test('renders the source in parentheses', () => {
      render(<Description text="Test (Source: Test)" />);

      expect(screen.getByText('(Source: Test)')).toBeInTheDocument();
    });
  });

  describe('on the same line in square brackets', () => {
    test('renders the source in parentheses', () => {
      render(<Description text="Test [Source: Test]" />);

      expect(screen.getByText('(Source: Test)')).toBeInTheDocument();
    });
  });

  describe('on the next line in parentheses', () => {
    test('renders the source in parentheses', () => {
      render(<Description text={'Test\n(Source: Test)'} />);

      expect(screen.getByText('(Source: Test)')).toBeInTheDocument();
    });
  });

  describe('on the next line in square brackets', () => {
    test('renders the source in parentheses', () => {
      render(<Description text={'Test\n[Source: Test]'} />);

      expect(screen.getByText('(Source: Test)')).toBeInTheDocument();
    });
  });

  describe('with a "Written by" source', () => {
    test('renders the source in parentheses', () => {
      render(<Description text="Test (Written by Test)" />);

      expect(screen.getByText('(Source: Test)')).toBeInTheDocument();
    });
  });
});
