export const one = {
  "id": "1",
  "type": "anime",
  "links": {
    "self": "/anime/1"
  },
  "attributes": {
    "slug": "trigun",
    "synopsis": "Trigun takes place in the distant future on a deserted planet. Vash the Stampede is a gunfighter with a legend so ruthless that he has a $$60,000,000,000 bounty on his head. Entire towns are evacuated upon hearing rumors of his arrival. However, the real Vash the Stampede is not the same man that rumor portrays him to be. The enigmatic and conflicted lead character in Trigun is actually more heroic in nature, and at times a complete and utter idiot.",
    "posterImage": "/images/poster.png",
    "coverImage": "/images/cover.png",
    "coverImageTopOffset": 100,
    "titles": {
      "en": null,
      "en_jp": "Trigun",
      "ja_jp": "トライガン"
    },
    "canonicalTitle": "Trigun",
    "abbreviatedTitles": null,
    "averageRating": 4.24367656836918,
    "ratingFrequencies": {
      "0.0": "4",
      "0.5": "9",
      "1.0": "36",
      "1.5": "16",
      "2.0": "57",
      "2.5": "135",
      "3.0": "630",
      "3.5": "1055",
      "4.0": "2292",
      "4.5": "1583",
      "5.0": "3067"
    },
    "startDate": "1998-04-01",
    "endDate": "1998-09-30",
    "episodeCount": 26,
    "episodeLength": 24,
    "showType": "special",
    "youtubeVideoId": "GyQn5USYuZE",
    "ageRating": "R",
    "ageRatingGuide": "Teens 13 or older"
  },
  "relationships": {
    "genres": {
      "links": {
        "self": "/anime/1/relationships/genres",
        "related": "/anime/1/genres"
      }
    },
    "castings": {
      "links": {
        "self": "/anime/1/relationships/castings",
        "related": "/anime/1/castings"
      }
    },
    "installments": {
      "links": {
        "self": "/anime/1/relationships/installments",
        "related": "/anime/1/installments"
      }
    },
    "mappings": {
      "links": {
        "self": "/anime/1/relationships/mappings",
        "related": "/anime/1/mappings"
      }
    },
    "streamingLinks": {
      "links": {
        "self": "/anime/1/relationships/streaming-links",
        "related": "/anime/1/streaming-links"
      }
    }
  }
};

export const two = {
  "id": "2",
  "type": "anime",
  "links": {
    "self": "/anime/2"
  },
  "attributes": {
      "slug": "naruto",
      "synopsis": "Naruto closely follows the life of a boy who is feared and detested by the villagers of the hidden leaf village of Konoha. The distrust of the boy has little to do with the boy himself, but it’s what’s inside him that causes anxiety. Long before Naruto came to be, a Kyuubi (demon fox) with great fury and power waged war taking many lives. The battle ensued for a long time until a man known as the Fourth Hokage, Yondaime, the strongest ninja in Konoha, fiercely fought the Kyuubi. The fight was soon won by Yondaime as he sealed the evil demon in a human body. Thus the boy, Naruto, was born. As Naruto grows he decides to become the strongest ninja in Konoha in an effort to show everyone that he is not as they perceive him to be, but is a human being worthy of love and admiration. But the road to becoming Hokage, the title for the strongest ninja in Konoha, is a long and arduous one. It is a path filled with betrayal, pain, and loss; but with hard work, Naruto may achieve Hokage.\n\n(Source: ANN)",
      "posterImage": "/images/poster.png",
      "coverImage": "/images/cover.png",
      "coverImageTopOffset": 209,
      "titles": {
        "en": null,
        "en_jp": "Naruto",
        "ja_jp": "NARUTO－ナルト－"
      },
      "canonicalTitle": "Naruto",
      "abbreviatedTitles": null,
      "averageRating": 3.7355306310736,
      "ratingFrequencies": {
        "0.0": "5",
        "0.5": "156",
        "1.0": "285",
        "1.5": "219",
        "2.0": "585",
        "2.5": "1093",
        "3.0": "2925",
        "3.5": "2949",
        "4.0": "3490",
        "4.5": "1313",
        "5.0": "4019"
      },
      "startDate": "2002-10-03",
      "endDate": "2007-02-08",
      "episodeCount": 220,
      "episodeLength": 23,
      "showType": "special",
      "youtubeVideoId": "",
      "ageRating": "R",
      "ageRatingGuide": "Teens 13 or older"
  },
  "relationships": {
    "genres": {
      "links": {
        "self": "/anime/2/relationships/genres",
        "related": "/anime/2/genres"
      }
    },
    "castings": {
      "links": {
        "self": "/anime/2/relationships/castings",
        "related": "/anime/2/castings"
      }
    },
    "installments": {
      "links": {
        "self": "/anime/2/relationships/installments",
        "related": "/anime/2/installments"
      }
    },
    "mappings": {
      "links": {
        "self": "/anime/2/relationships/mappings",
        "related": "/anime/2/mappings"
      }
    },
    "streamingLinks": {
      "links": {
        "self": "/anime/2/relationships/streaming-links",
        "related": "/anime/2/streaming-links"
      }
    }
  }
};

export const arrayResponse = { data: [one, two] };
export const objectResponse = { data: one };
