/* eslint-disable */
export const one = {
  "id": "1",
  "type": "users",
  "links": {
    "self": "/users/1"
  },
  "attributes": {
    "name": "bob",
    "pastNames": [],
    "avatar": {
      "original": "/images/avatar.png",
      "tiny": "/images/avatar.png",
      "small": "/images/avatar.png",
      "medium": "/images/avatar.png",
      "large": "/images/avatar.png",
    },
    "coverImage": "/images/cover.png",
    "about": "About Section",
    "bio": "Hello, World!",
    "aboutFormatted": "About Formatted",
    "location": "Earth",
    "website": "https://www.google.com",
    "waifuOrHusbando": "Waifu",
    "toFollow": true,
    "followerCount": 100,
    "followingCount": 200,
    "onboarded": true,
    "lifeSpentOnAnime": 9001
  }
};

export const objectResponse = { data: one };
export const arrayResponse = { data: [one] };
