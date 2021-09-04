import React, { useContext } from 'react';
import { useList } from 'react-use';
import { uniqueId } from 'lodash-es';

export type ToasterItemID = string;
export type ToasterItem = (args: {
  close: () => void;
  key: ToasterItemID;
}) => React.ReactNode;
type ToasterListItem = {
  item: ToasterItem;
  id: ToasterItemID;
};
type Toaster = {
  items: ToasterListItem[];
  add: (item: ToasterItem) => ToasterItemID;
  remove: (item: ToasterItemID) => void;
  replace: (item: ToasterListItem) => ToasterItemID;
};

export const ToasterContext = React.createContext<Toaster | null>(null);

export const ToasterContextProvider: React.FC = function ({ children }) {
  const [list, actions] = useList<ToasterListItem>([]);

  const toaster: Toaster = {
    items: list,
    add(item: ToasterItem) {
      const id = uniqueId('toast-');
      actions.insertAt(0, { id, item });
      return id;
    },
    remove(id: ToasterItemID) {
      actions.filter(({ id: itemId }) => id !== itemId);
    },
    replace(item: ToasterListItem) {
      actions.updateFirst((a, b) => a.id === b.id, item);
      return item.id;
    },
  };

  return (
    <ToasterContext.Provider value={toaster}>
      {children}
    </ToasterContext.Provider>
  );
};

export const useToaster = function (): Toaster {
  // As long as the provider is used, the context will NEVER be null.
  return useContext(ToasterContext) as Toaster;
};
