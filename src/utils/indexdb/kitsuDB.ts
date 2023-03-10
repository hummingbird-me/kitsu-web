import { openDB } from 'idb';

export const kitsuDB = await openDB('kitsu-qu-embed', 1, {
  upgrade(db) {
    if (!db.objectStoreNames.contains('MediaMappings')) {
      const mappings = db.createObjectStore('mappings', {
        keyPath: 'id',
        autoIncrement: true,
      });

      mappings.createIndex(
        'external_media_source_external_media_id_media_type_index',
        ['external_media_source', 'external_media_id', 'media_type'],
        { unique: true }
      );
    }
  },
});
