import { MediaTypeEnum } from 'app/graphql/types';

export type CachedRecord = {
  id?: number;
  external_media_source: string;
  external_media_id: string;
  media_type: MediaTypeEnum;
  kitsu_media_id: string;
};
