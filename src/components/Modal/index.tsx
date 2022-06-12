import React, { DialogHTMLAttributes } from 'react';
import { BsX } from 'react-icons/bs';
import * as Dialog from '@radix-ui/react-dialog';
import { AccessibleIcon } from '@radix-ui/react-accessible-icon';
import { useIntl } from 'react-intl';

import { IsModalContextProvider } from 'app/contexts/ModalContext';
import { HeaderSettings } from 'app/contexts/LayoutSettingsContext';
import useReturnToFn from 'app/hooks/useReturnToFn';

import styles from './styles.module.css';

export const Scrim = React.forwardRef<
  HTMLDivElement,
  React.PropsWithChildren<{
    displayMode: 'page' | 'modal';
  }>
>(function Scrim({ displayMode, children }, ref) {
  return (
    <div
      ref={ref}
      data-testid="scrim"
      className={
        displayMode === 'page' ? styles.pageContainer : styles.modalContainer
      }>
      {displayMode === 'page' ? (
        <HeaderSettings background="opaque" scrollBackground="opaque" />
      ) : null}
      {children}
    </div>
  );
});

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
  const { formatMessage } = useIntl();

  return (
    <IsModalContextProvider>
      <Dialog.Root defaultOpen onOpenChange={(isOpen) => isOpen || goBack()}>
        <Dialog.Overlay asChild>
          <Scrim displayMode={displayMode}>
            <Dialog.Content asChild>
              <dialog
                data-testid="modal"
                open
                className={[className, styles.modal].join(' ')}
                {...args}>
                <Dialog.Close className={styles.closeButton}>
                  <AccessibleIcon
                    label={formatMessage({
                      defaultMessage: 'Close',
                      description: 'Accessibility label for modal close button',
                    })}>
                    <BsX />
                  </AccessibleIcon>
                </Dialog.Close>
                {children}
              </dialog>
            </Dialog.Content>
          </Scrim>
        </Dialog.Overlay>
      </Dialog.Root>
    </IsModalContextProvider>
  );
};

export default Modal;
