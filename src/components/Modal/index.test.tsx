import { describe, test, expect } from 'vitest';
import React from 'react';
import { unstable_HistoryRouter as HistoryRouter } from 'react-router-dom';
import { createMemoryHistory } from 'history';
import { render, screen } from 'app/test-utils/testing-library';
import userEvent from '@testing-library/user-event';

import Modal from './index';

// TODO: @testing-library/user-event gets confused by the nesting of pointer-events from Body (none)
// to Scrim (auto) to Modal (auto), we should file an issue on their repo to fix this. Until then,
// we just skip the tests which use pointer-events. These have been manually tested in the browser.
describe.skip('with displayMode="modal"', () => {
  test('handles clicking out of the modal', async () => {
    const history = createMemoryHistory({
      initialEntries: ['/modal?returnTo=/back'],
    });

    render(
      <HistoryRouter history={history}>
        <Modal displayMode="modal" />
      </HistoryRouter>
    );

    expect(history.location.pathname).toBe('/modal');
    await userEvent.click(screen.getByTestId('scrim'));
    expect(history.location.pathname).toBe('/back');
  });

  test('clicking in the modal does not navigate away', async () => {
    const history = createMemoryHistory({
      initialEntries: ['/back', '/modal'],
      initialIndex: 1,
    });

    render(
      <HistoryRouter history={history}>
        <Modal displayMode="modal">
          <button>Test</button>
        </Modal>
      </HistoryRouter>
    );

    screen.debug();

    expect(history.location.pathname).toBe('/modal');
    await userEvent.click(screen.getByText('Test'));
    expect(history.location.pathname).toBe('/modal');
  });
});

describe('with displayMode="page"', () => {
  test('clicking on the close button navigates to the returnTo parameter', async () => {
    const history = createMemoryHistory({
      initialEntries: ['/modal?returnTo=/previous'],
    });

    render(
      <HistoryRouter history={history}>
        <Modal displayMode="page" />
      </HistoryRouter>
    );

    expect(history.location.pathname).toBe('/modal');
    await userEvent.click(screen.getByText('Close'));
    expect(history.location.pathname).toBe('/previous');
  });

  test('clicking on the scrim navigates to the returnTo parameter', async () => {
    const history = createMemoryHistory({
      initialEntries: ['/modal?returnTo=/previous'],
    });

    render(
      <HistoryRouter history={history}>
        <Modal displayMode="page" />
      </HistoryRouter>
    );

    expect(history.location.pathname).toBe('/modal');
    await userEvent.click(screen.getByTestId('scrim'));
    expect(history.location.pathname).toBe('/previous');
  });

  test('clicking in the modal does not navigate away', async () => {
    const history = createMemoryHistory({
      initialEntries: ['/back', '/modal'],
      initialIndex: 1,
    });

    render(
      <HistoryRouter history={history}>
        <Modal displayMode="page">
          <button>Test</button>
        </Modal>
      </HistoryRouter>
    );

    expect(history.location.pathname).toBe('/modal');
    await userEvent.click(screen.getByText('Test'));
    expect(history.location.pathname).toBe('/modal');
  });
});
