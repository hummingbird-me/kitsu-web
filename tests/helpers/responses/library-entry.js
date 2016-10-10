export const created = {
  "id": "1",
  "type": "libraryEntries",
  "links": {
    "self": "/library-entries/1"
  },
  "attributes": {
    "status": "current",
    "progress": 0,
    "reconsuming": false,
    "reconsumeCount": 0,
    "notes": null,
    "private": false,
    "rating": 4.5,
    "updatedAt": "2013-03-28"
  },
  "relationships": {
    "user": {
      "links": {
        "self": "/library-entries/1/relationships/user",
        "related": "/library-entries/1/user"
      },
      "data": { "type": "users", "id": "1" }
    },
    "media": {
      "links": {
        "self": "/library-entries/1/relationships/media",
        "related": "/library-entries/1/media"
      },
      "data": { "type": "anime", "id": "1" }
    }
  }
}

export const createdResponse = { data: created };
