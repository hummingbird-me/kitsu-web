import React from 'react';

import { PathBuilder } from 'app/utils/routes';

import {
  modals as authModals,
  pages as authPages,
  paths as authPaths,
} from './Auth/routes';

export const pages = <>{authPages}</>;
export const modals = <>{authModals}</>;
export const paths = {
  auth: authPaths,
} satisfies PathBuilder;
