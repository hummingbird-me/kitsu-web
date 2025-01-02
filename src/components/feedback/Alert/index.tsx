import React from 'react';
import { FaTimes } from 'react-icons/fa';

import styles from './styles.module.css';

/**
 * The kind of alert to display.
 *
 * `success` - Success alerts inform the user that an action they requested has been completed successfully. In many
 *    circumstances, this will not be necessary since the user will be able to see the result of the action itself,
 *    but some actions may lack an obvious result, and this can be used to provide a visual indication that the
 *    action has been completed.
 * `warning` - Warning alerts are generally used in two circumstances: either an action *partially* failed in a way
 *    which likely doesn't matter, or there's an important message the user should be aware of before performing an
 *    action.
 * `error` - Error alerts are the most important kind of alert, and are used when an action failed completely or
 *    thoroughly enough that the user would consider it completely failed. For validation errors, prefer to indicate
 *    next to the input using a different component.
 * `info` - Info alerts are neutral, and typically not connected to an action the user performed. Instead, they
 *    generally *inform* the user of something relating to a form. Honestly? You probably won't use these much.
 *    There's generally a better option in any context, but this is here in case you need it.
 */
export type AlertKind = 'success' | 'info' | 'warning' | 'error';

/**
 * Alerts provide contextual feedback for a variety of user actions. They can hold any length of text,
 * as well as optional close button, icon, and header text. Alerts are typically used to communicate
 * error or success messages to the user at the top of the form which they pertain to.
 *
 * @param kind What type of alert to display.
 * @param onDismiss If passed, a dismiss button will be rendered and this function will be called when it is clicked.
 */
const Alert: React.FC<{
  children: React.ReactNode;
  className?: string;
  onDismiss?: () => void;
  kind: AlertKind;
}> = function ({ children, kind, onDismiss, className = '' }) {
  return (
    <div className={[styles.alert, styles[kind], className].join(' ')}>
      <div>{children}</div>
      {onDismiss && (
        <button className={styles.dismiss} onClick={onDismiss}>
          <FaTimes />
        </button>
      )}
    </div>
  );
};

export default Alert;
