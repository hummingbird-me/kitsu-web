import React from 'react';
import { renderToString } from 'react-dom/server';
import { StaticRouter } from 'react-router-dom';

import App from 'app/App';

export function render(url: string, context: unknown): string {
  return renderToString(
    <StaticRouter location={url} context={context}>
      <App />
    </StaticRouter>
  );
}
