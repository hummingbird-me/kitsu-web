import userEvent from '@testing-library/user-event';
import React from 'react';
import { RouterProvider, createMemoryRouter } from 'react-router-dom';
import { describe, expect, test } from 'vitest';

import { render, screen } from 'app/test-utils/testing-library';

import Modal from './index';

describe('with displayMode="modal"', () => {
  test('handles clicking out of the modal', async () => {
    const router = createMemoryRouter(
      [
        {
          element: <Modal displayMode="modal" />,
          path: '/modal',
        },
        { element: <></>, path: '/back' },
      ],
      {
        initialEntries: ['/modal?returnTo=/back'],
      }
    );

    render(<RouterProvider router={router} />);

    expect(router.state.location.pathname).toBe('/modal');
    await userEvent.click(screen.getByTestId('scrim'));
    expect(router.state.location.pathname).toBe('/back');
  });

  test('clicking in the modal does not navigate away', async () => {
    const router = createMemoryRouter(
      [
        {
          element: <Modal displayMode="modal">Test</Modal>,
          path: '/modal',
        },
        { element: <></>, path: '/back' },
      ],
      {
        initialEntries: ['/back', '/modal'],
        initialIndex: 1,
      }
    );

    render(<RouterProvider router={router} />);

    expect(router.state.location.pathname).toBe('/modal');
    await userEvent.click(screen.getByText('Test'));
    expect(router.state.location.pathname).toBe('/modal');
  });
});

describe('with displayMode="page"', () => {
  test('clicking on the close button navigates to the returnTo parameter', async () => {
    const router = createMemoryRouter(
      [
        {
          element: <Modal displayMode="page" />,
          path: '/modal',
        },
        { element: <></>, path: '/previous' },
      ],
      {
        initialEntries: ['/modal?returnTo=/previous'],
      }
    );

    render(<RouterProvider router={router} />);

    expect(router.state.location.pathname).toBe('/modal');
    await userEvent.click(screen.getByText('Close'));
    expect(router.state.location.pathname).toBe('/previous');
  });

  test('clicking on the scrim navigates to the returnTo parameter', async () => {
    const router = createMemoryRouter(
      [
        {
          element: <Modal displayMode="page" />,
          path: '/modal',
        },
        { element: <></>, path: '/previous' },
      ],
      {
        initialEntries: ['/modal?returnTo=/previous'],
      }
    );

    render(<RouterProvider router={router} />);

    expect(router.state.location.pathname).toBe('/modal');
    await userEvent.click(screen.getByTestId('scrim'));
    expect(router.state.location.pathname).toBe('/previous');
  });

  test('clicking in the modal does not navigate away', async () => {
    const router = createMemoryRouter(
      [
        {
          element: (
            <Modal displayMode="page">
              <button>Test</button>
            </Modal>
          ),
          path: '/modal',
        },
        { element: <>Penis</>, path: '/back' },
      ],
      {
        initialEntries: ['/back', '/modal'],
        initialIndex: 1,
      }
    );

    render(<RouterProvider router={router} />);

    expect(router.state.location.pathname).toBe('/modal');
    await userEvent.click(screen.getByText('Test'));
    expect(router.state.location.pathname).toBe('/modal');
  });
});
