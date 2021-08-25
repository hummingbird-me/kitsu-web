import React, { DialogHTMLAttributes, useEffect } from 'react';
import { useHistory, useLocation } from 'react-router-dom';
import { Location } from 'history';

import useQueryParams from 'app/hooks/useQueryParams';
import { IsModalContextProvider } from 'app/contexts/ModalContext';
import { HeaderSettings } from 'app/contexts/LayoutSettingsContext';

import styles from './styles.module.css';
import useReturnToFn from 'app/hooks/useReturnToFn';

/**
 * A Modal or dialog box component
 *
 * Modals can be displayed in either "modal" or "page" mode, depending on how they were navigated
 * to.  In "modal" mode, it displays a scrim over the current page, while in "page" mode it displays
 * the modal on top of a generic background. There are also minor behavioral differences between the
 * two modes, primarily in how the modal behaves when it is closed.
 *
 * @param {string} displayMode - which style the modal should be displayed in
 */
const Modal: React.FC<
  { displayMode: 'modal' | 'page' } & DialogHTMLAttributes<HTMLDialogElement>
> = function ({ children, className, displayMode = 'modal', ...args }) {
  const goBack = useReturnToFn();

  // When displaying as a modal, we need to lock the scrolling of the page
  useEffect(() => {
    if (displayMode === 'modal') {
      document.body.classList.add('scroll-lock');
      return () => document.body.classList.remove('scroll-lock');
    }
  }, [displayMode]);

  return (
    <>
      {displayMode === 'page' ? (
        <HeaderSettings background="opaque" scrollBackground="opaque" />
      ) : null}
      <IsModalContextProvider>
        <div
          data-testid="scrim"
          className={
            displayMode === 'modal'
              ? styles.modalContainer
              : styles.pageContainer
          }
          onClick={goBack}>
          <dialog
            data-testid="modal"
            open
            className={[className, styles.modal].join(' ')}
            onClick={(e) => e.stopPropagation()}
            {...args}>
            {children}
          </dialog>
        </div>
      </IsModalContextProvider>
    </>
  );
};

export default Modal;
