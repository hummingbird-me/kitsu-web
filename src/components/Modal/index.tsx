import { AccessibleIcon } from '@radix-ui/react-accessible-icon';
import * as Dialog from '@radix-ui/react-dialog';
import React, { DialogHTMLAttributes } from 'react';
import { BsX } from 'react-icons/bs';
import { useIntl } from 'react-intl';

import { HeaderSettings } from 'app/contexts/LayoutSettingsContext';
import { IsModalContextProvider } from 'app/contexts/ModalContext';
import useReturnToFn from 'app/hooks/useReturnToFn';

import styles from './styles.module.css';

const PageModal: React.FC<DialogHTMLAttributes<HTMLDialogElement>> = function ({
  children,
  className,
  ...args
}) {
  const goBack = useReturnToFn();
  const { formatMessage } = useIntl();

  return (
    <IsModalContextProvider>
      <HeaderSettings background="opaque" scrollBackground="opaque" />
      <div
        className={styles.pageContainer}
        onPointerDown={goBack}
        data-testid="scrim"
      >
        <dialog
          data-testid="modal"
          open
          onPointerDown={(e) => e.stopPropagation()}
          className={[className, styles.modal].join(' ')}
          {...args}
        >
          <button className={styles.closeButton} onPointerDown={goBack}>
            <AccessibleIcon
              label={formatMessage({
                defaultMessage: 'Close',
                description: 'Accessibility label for modal close button',
              })}
            >
              <BsX />
            </AccessibleIcon>
          </button>
          {children}
        </dialog>
      </div>
    </IsModalContextProvider>
  );
};

const OverlayModal: React.FC<DialogHTMLAttributes<HTMLDialogElement>> =
  function ({ children, className }) {
    const goBack = useReturnToFn();
    const { formatMessage } = useIntl();

    return (
      <IsModalContextProvider>
        <Dialog.Root defaultOpen onOpenChange={(isOpen) => isOpen || goBack()}>
          <Dialog.Overlay asChild>
            <div
              onPointerDown={goBack}
              data-testid="scrim"
              className={styles.modalContainer}
            >
              <Dialog.Content
                asChild
                onEscapeKeyDown={() => goBack()}
                onPointerDownOutside={(e) => e.preventDefault()}
              >
                <dialog
                  data-testid="modal"
                  open
                  onPointerDown={(e) => e.stopPropagation()}
                  className={[className, styles.modal].join(' ')}
                >
                  <Dialog.Close className={styles.closeButton}>
                    <AccessibleIcon
                      label={formatMessage({
                        defaultMessage: 'Close',
                        description:
                          'Accessibility label for modal close button',
                      })}
                    >
                      <BsX />
                    </AccessibleIcon>
                  </Dialog.Close>
                  {children}
                </dialog>
              </Dialog.Content>
            </div>
          </Dialog.Overlay>
        </Dialog.Root>
      </IsModalContextProvider>
    );
  };

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
> = function ({ displayMode, ...args }) {
  return displayMode === 'modal' ? (
    <OverlayModal {...args} />
  ) : (
    <PageModal {...args} />
  );
};

export default Modal;
