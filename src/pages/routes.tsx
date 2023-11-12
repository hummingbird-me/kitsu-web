import React from 'react';

import { PathBuilder } from 'app/utils/routes';

import { pages as animePages, paths as animePaths } from './Anime/routes';
import {
  modals as authModals,
  pages as authPages,
  paths as authPaths,
} from './Auth/routes';
import { paths as profilePaths } from './Profile/routes';

export const pages = (
  <>
    {authPages}
    {animePages}
  </>
);
export const modals = <>{authModals}</>;
export const paths = {
  anime: animePaths,
  auth: authPaths,
  profile: profilePaths,
} satisfies PathBuilder;
