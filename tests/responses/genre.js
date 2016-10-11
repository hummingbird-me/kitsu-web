export const one = {
  "id": "1",
  "type": "genres",
  "links:": {
    "self": "/genres/1"
  },
  "attributes": {
    "name": "Action",
    "slug": "action",
    "description": null
  }
};

export const two = {
  "id": "2",
  "type": "genres",
  "links": {
    "self": "/genres/2"
  },
  "attributes": {
    "name": "Adventure",
    "slug": "adventure",
    "description": null
  }
};

export const three = {
  "id": "3",
  "type": "genres",
  "links": {
    "self": "/genres/3"
  },
  "attributes": {
    "name": "Comedy",
    "slug": "comedy",
    "description": null
  }
};

export const arrayResponse = { data: [one, two, three] };
export const objectResponse = { data: one };
