import React, { DialogHTMLAttributes, useEffect } from 'react';
import { useHistory, useLocation } from 'react-router-dom';
import { Location } from 'history';

import useQueryParams from 'app/hooks/useQueryParams';
import {
  IsModalContext,
  IsModalContextProvider,
} from 'app/contexts/ModalContext';
import Header from 'app/components/Header';

import styles from './styles.module.css';

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
  const location = useLocation<{ background?: Location }>();
  const history = useHistory();
  const params = useQueryParams();

  // When displaying as a modal, we need to lock the scrolling of the page
  useEffect(() => {
    if (displayMode === 'modal') {
      document.body.classList.add('scroll-lock');
      return () => document.body.classList.remove('scroll-lock');
    }
  }, [displayMode]);

  // When displaying as a modal, closing should return to the underlying page. When displaying as a
  // page, we need to use the returnTo parameter to determine which page to return to.
  const goBack = () => {
    const returnTo = params.get('returnTo');
    if (displayMode === 'modal' && location.state?.background) {
      history.push(location.state?.background);
    } else if (returnTo) {
      history.push(returnTo);
    }
  };

  return (
    <>
      {displayMode === 'page' ? <Header background="opaque" /> : null}
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
