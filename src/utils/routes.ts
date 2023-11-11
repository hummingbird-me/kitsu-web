/*
 * This class provides a simple fluent API for generating route URLs for links, so you don't have
 * to do the manual string manipulation and calls to URL/URLSearchParam to build your own URLs.
 */

export class Path {
  path: string;
  query: URLSearchParams;
  fragment: string;

  constructor(
    path = '/',
    query: URLSearchParams | Record<string, string> = new URLSearchParams(),
    fragment = '',
  ) {
    this.path = path;
    this.query = new URLSearchParams(query);
    this.fragment = fragment;
  }

  clone() {
    // @ts-ignore - TypeScript doesn't think we can construct our own constructor
    return new this.constructor(this.path, this.query, this.fragment);
  }

  /**
   * Appends to the path
   */
  append(path: string) {
    // @ts-ignore - TypeScript doesn't think we can construct our own constructor
    return new this.constructor(this.path + path, this.query, this.fragment);
  }

  toString(): string {
    return [
      this.path,
      this.query.size > 0 ? `?${this.query}` : '',
      this.fragment ? `#${this.fragment}` : '',
    ].join('');
  }
}

export class PathTree<Subpaths extends Record<string, PathBuilder> = Record<string, PathBuilder>> {
  #path: Path;
  [key: string]: PathBuilder;

  constructor(path: string | Path, subpaths: Subpaths) {
    if (path instanceof Path) {
      this.#path = path;
    } else {
      this.#path = new Path(path);
    }
    for (const key of Object.keys(subpaths)) {
      this[key] = subpaths[key];
    }
  }
  toString(): string {
    return this.#path.toString();
  }
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type PathFunction = (...args: any) => PathBuilder;
export type PathRecords = { [key: string]: PathBuilder };
export type PathBuilder = PathFunction | PathRecords | PathTree | Path | string;
