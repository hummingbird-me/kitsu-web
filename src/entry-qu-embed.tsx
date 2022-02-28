import React from 'react';
import ReactDOM from 'react-dom';

import QUEmbedApp from 'app/QUEmbedApp';
import { MemoryRouter } from 'react-router-dom';

ReactDOM.render(
  <MemoryRouter>
    <QUEmbedApp />
  </MemoryRouter>,
  document.getElementById('app')
);
