import React, { useEffect } from 'react';
import { useHistory } from 'react-router-dom';

import useQueryParams from 'app/hooks/useQueryParams';

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
const Modal: React.FC<{ displayMode: 'modal' | 'page' }> = function ({
  children,
  displayMode = 'modal',
}) {
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
    if (displayMode === 'modal') {
      history.goBack();
    } else if (returnTo) {
      history.push(returnTo);
    }
  };

  return (
    <div
      data-testid="scrim"
      className={
        displayMode === 'modal' ? styles.modalContainer : styles.pageContainer
      }
      onClick={goBack}>
      <dialog
        data-testid="modal"
        open
        className={styles.modal}
        onClick={(e) => e.stopPropagation()}>
        {children}
      </dialog>
    </div>
  );
};

export default Modal;
