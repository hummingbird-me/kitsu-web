import React from 'react';
import { createRoot } from 'react-dom/client';
import { HashRouter } from 'react-router-dom';

import QUEmbedApp from 'app/QUEmbedApp';

const container = document.getElementById('app');
const root = createRoot(container!);

root.render(
  <HashRouter>
    <QUEmbedApp />
  </HashRouter>
);
