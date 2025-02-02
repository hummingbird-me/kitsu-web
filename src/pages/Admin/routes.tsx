import React from 'react';
import { Route } from 'react-router-dom';

import { Path, type PathBuilder } from 'app/utils/routes';

import HeldContent from './HeldContent/HeldContentPage';

export const pages = (
  <Route path="admin">
    <Route path="held" element={<HeldContent />} />
  </Route>
);

export const paths = {
  held: new Path('/admin/held'),
} satisfies PathBuilder;
