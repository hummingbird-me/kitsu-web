import { describe, test, expect } from 'vitest';

import routes from './routes';

describe('Route Generators', () => {
  describe('.home', () => {
    test('should generate the home url', () => {
      expect(routes.home.path).toEqual('/');
    });
  });

  describe('.profile', () => {
    test('should generate a profile url', () => {
      expect(routes.profile('5554').path).toEqual('/users/5554');
    });

    describe('.library', () => {
      test('should generate a library URL', () => {
        expect(routes.profile('5554').library('anime').path).toEqual(
          '/users/5554/library/anime'
        );
      });
    });
  });

  describe('.media', () => {
    test('should generate a media url', () => {
      expect(routes.media('anime', 'one-piece').path).toEqual(
        '/anime/one-piece'
      );
    });

    describe('.episodes', () => {
      test('should generate a URL to the episode list', () => {
        expect(routes.media('anime', 'one-piece').episodes.path).toEqual(
          '/anime/one-piece/episodes'
        );
      });
    });

    describe('.episode', () => {
      test('should generate a URL to a specific episode', () => {
        expect(routes.media('anime', 'one-piece').episode(1).path).toEqual(
          '/anime/one-piece/episodes/1'
        );
      });
    });

    describe('.characters', () => {
      test('should generate a URL to the character list', () => {
        expect(routes.media('anime', 'one-piece').characters.path).toEqual(
          '/anime/one-piece/characters'
        );
      });
    });

    describe('.reactions', () => {
      test('should generate a URL to the reactions list', () => {
        expect(routes.media('anime', 'one-piece').reactions.path).toEqual(
          '/anime/one-piece/reactions'
        );
      });
    });
  });
});
