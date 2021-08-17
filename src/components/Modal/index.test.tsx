import React from 'react';
import { Router, MemoryRouter } from 'react-router-dom';
import { createMemoryHistory } from 'history';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import Modal from './index';

describe('with displayMode="modal"', () => {
  test('handles clicking out of the modal', async () => {
    const history = createMemoryHistory({
      initialEntries: ['/modal?returnTo=/back'],
    });

    render(
      <Router history={history}>
        <Modal displayMode="modal" />
      </Router>
    );

    expect(history.location.pathname).toBe('/modal');
    userEvent.click(screen.getByTestId('scrim'));
    expect(history.location.pathname).toBe('/back');
  });

  test('clicking in the modal does not navigate away', async () => {
    const history = createMemoryHistory({
      initialEntries: ['/back', '/modal'],
      initialIndex: 1,
    });

    render(
      <Router history={history}>
        <Modal displayMode="modal" />
      </Router>
    );

    expect(history.location.pathname).toBe('/modal');
    userEvent.click(screen.getByTestId('modal'));
    expect(history.location.pathname).toBe('/modal');
  });

  test('adds a scroll-lock class to the document body', async () => {
    const { unmount } = render(
      <MemoryRouter>
        <Modal displayMode="modal" />
      </MemoryRouter>
    );

    expect(document.body.classList.contains('scroll-lock')).toBe(true);
    unmount();
    expect(document.body.classList.contains('scroll-lock')).toBe(false);
  });
});

describe('with displayMode="page"', () => {
  test('does not add a scroll-lock class to the document body', async () => {
    render(
      <MemoryRouter>
        <Modal displayMode="page" />
      </MemoryRouter>
    );

    expect(document.body.classList.contains('scroll-lock')).toBe(false);
  });

  test('clicking on the scrim navigates to the returnTo parameter', async () => {
    const history = createMemoryHistory({
      initialEntries: ['/modal?returnTo=/previous'],
    });

    render(
      <Router history={history}>
        <Modal displayMode="page" />
      </Router>
    );

    expect(history.location.pathname).toBe('/modal');
    userEvent.click(screen.getByTestId('scrim'));
    expect(history.location.pathname).toBe('/previous');
  });
});
