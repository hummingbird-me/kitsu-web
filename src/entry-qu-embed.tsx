import React from 'react';
import ReactDOM from 'react-dom';

import QUEmbedApp from 'app/QUEmbedApp';
import { HashRouter } from 'react-router-dom';

ReactDOM.render(
  <HashRouter>
    <QUEmbedApp />
  </HashRouter>,
  document.getElementById('app')
);
