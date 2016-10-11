export const one = {
  "id": "1",
  "type": "streamers",
  "links": {
    "self": "/streamers/1"
  },
  "attributes": {
    "siteName": "Hulu",
    "logo": "/images/hulu.png"
  },
  "relationships": {
    "streamingLinks": {
      "links": {
        "self": "/streamers/1/relationships/streaming-links",
        "related": "/streamers/1/streaming-links"
      }
    }
  }
};

export const two = {
  "id": "2",
  "type": "streamers",
  "links": {
    "self": "/streamers/2"
  },
  "attributes": {
    "siteName": "Crunchyroll",
    "logo": "/images/crunchyroll.png"
  },
  "relationships": {
    "streamingLinks": {
      "links": {
        "self": "/streamers/2/relationships/streaming-links",
        "related": "/streamers/2/streaming-links"
      }
    }
  }
};

export const three = {
  "id": "3",
  "type": "streamers",
  "links": {
    "self": "/streamers/3"
  },
  "attributes": {
    "siteName": "Netflix",
    "logo": "/images/netflix.png"
  },
  "relationships": {
    "streamingLinks": {
      "links": {
        "self": "/streamers/3/relationships/streaming-links",
        "related": "/streamers/3/streaming-links"
      }
    }
  }
};

export const arrayResponse = { data: [one, two, three] };
export const objectResponse = { data: one };
