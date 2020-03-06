import { typeOf } from '@ember/utils';

export const ObserverMap = new Map();
export const ListenerMap = new WeakMap();

const sortObject = object => (
  Object.keys(object).sort().reduce((previous, current) => {
    if (typeOf(object[current]) === 'object') {
      // eslint-disable-next-line
      previous[current] = sortObject(object[current]);
      return previous;
    }
    previous[current] = object[current]; // eslint-disable-line
    return previous;
  }, {})
);

const mapGetWithDefault = (map, key, value) => {
  if (map.has(key)) {
    return map.get(key);
  }
  map.set(key, value);
  return map.get(key);
};

// Code based on https://github.com/m59peacemaker/browser-insular-observer
export default function observerManager(options = {}) {
  // Get an observer that we have already registered with these options,
  // or create a new one.
  const key = JSON.stringify(sortObject(options));
  let observer = ObserverMap.get(key);
  if (observer === undefined) {
    const callback = entries => {
      entries.forEach(entry => {
        const targets = mapGetWithDefault(ListenerMap, entry.target, []);
        targets.forEach(listener => listener(entry));
      });
    };

    observer = new IntersectionObserver(callback, options);
    ObserverMap.set(key, observer);
  }

  // Observe the target using the correct IntersectionObserver
  return function observe(target, listener) {
    const targets = mapGetWithDefault(ListenerMap, target, []);
    targets.push(listener);
    observer.observe(target);

    // Return a function to cleanup
    return function disconnect() {
      const idx = targets.indexOf(listener);
      targets.splice(idx, 1);

      if (targets.length === 0) {
        ListenerMap.delete(target);
        return observer.unobserve && observer.unobserve(target);
      }
    };
  };
}
