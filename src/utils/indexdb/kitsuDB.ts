import { openDB } from 'idb';

export const kitsuDB = await openDB('kitsu-qu-embed', 1, {
  upgrade(db) {
    if (!db.objectStoreNames.contains('MediaMappings')) {
      db.createObjectStore('mappings', {
        keyPath: ['external_media_source', 'external_media_id', 'media_type'],
      });
    }
  },
});
