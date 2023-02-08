import React from 'react';
import { createRoot } from 'react-dom/client';

import QUEmbedApp from 'app/QUEmbedApp';
import { HashRouter } from 'react-router-dom';

const container = document.getElementById('app');
const root = createRoot(container!);

root.render(
  <HashRouter>
    <QUEmbedApp />
  </HashRouter>
);
