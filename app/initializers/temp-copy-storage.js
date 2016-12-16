export function initialize() {
  /**
   * Copy settings saved in localStorage `feed.type` to the new general `lastUsed.feedType`
   *
   * This can be removed after sitting in production for 1+ week.
   */
  const { type: oldType } = JSON.parse(localStorage.getItem('storage:feed')) || {};
  if (oldType) {
    const current = localStorage.getItem('storage:last-used');
    localStorage.setItem('storage:last-used', JSON.stringify(Object.assign({ feedType: oldType }, current)));
    localStorage.removeItem('storage:feed');
  }
}

export default {
  name: 'temp-copy-storage',
  initialize
};
