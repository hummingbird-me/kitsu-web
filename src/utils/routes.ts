/*
 * These classes provide a simple fluent API for generating route URLs for links, so you don't have
 * to do the manual string manipulation and calls to URL/URLSearchParam to build your own URLs.
 */

class PathBuilder {
  #path = '/';
  #query?: URLSearchParams;
  #fragment?: string;

  /**
   * Creates a new PathBuilder
   */
  constructor(path: string, query?: URLSearchParams, fragment?: string) {
    this.#path = path;
    this.#query = query;
    this.#fragment = fragment;
  }

  /**
   * Appends to the path
   */
  append(path: string) {
    // @ts-ignore - TypeScript doesn't think we can construct our own constructor
    return new this.constructor(this.#path + path, this.#query, this.#fragment);
  }

  /**
   * Adds some query parameters to the path
   */
  query(query: { [key: string]: string }) {
    const params = new URLSearchParams(this.#query);
    for (const [key, value] of Object.entries(query)) {
      params.append(key, value);
    }

    // @ts-ignore - TypeScript doesn't think we can construct our own constructor
    return new this.constructor(this.#path, params, this.#fragment);
  }

  /**
   * Sets the fragment of the path
   */
  fragment(fragment: string) {
    // @ts-ignore - TypeScript doesn't think we can construct our own constructor
    return new this.constructor(this.#path, this.#query, fragment);
  }

  /**
   * Collapses the path to a string
   */
  get path() {
    return [
      this.#path,
      this.#query ? `?${this.#query}` : '',
      this.#fragment ? `#${this.#fragment}` : '',
    ].join('');
  }
}

/**
 * RouteBuilder provides a fluent interface for generating URLs to Kitsu routes. It's like a
 * choose-your-own-adventure of URL construction!
 */
export default class RouteBuilder extends PathBuilder {
  static get home() {
    return new RouteBuilder('/');
  }

  static profile(slugOrId: string) {
    return new ProfileRouteBuilder(`/users/${slugOrId}`);
  }

  static media(type: string, slug: string) {
    return new MediaRouteBuilder(`/${type}/${slug}`);
  }
}

class ProfileRouteBuilder extends RouteBuilder {
  library(type: string) {
    return this.append(`/library/${type}`);
  }

  get reactions() {
    return this.append('/reactions');
  }

  get reviews() {
    return this.append('/reviews');
  }

  get followers() {
    return this.append('/followers');
  }

  get following() {
    return this.append('/following');
  }

  get groups() {
    return this.append('/groups');
  }
}

class MediaRouteBuilder extends RouteBuilder {
  get episodes() {
    return this.append('/episodes');
  }

  episode(episode: string | number) {
    return this.append(`/episodes/${episode}`);
  }

  get characters() {
    return this.append('/characters');
  }

  get staff() {
    return this.append('/staff');
  }

  get reactions() {
    return this.append('/reactions');
  }

  get franchise() {
    return this.append('/franchise');
  }

  get quotes() {
    return this.append('/quotes');
  }

  quote(id: string | number) {
    return this.append(`/quotes/${id}`);
  }
}
