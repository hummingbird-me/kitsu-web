/**
 * A version of an image, usually resized/converted/etc.
 */
export type ImageView = {
  /** Height of the image in pixels */
  height: number;
  /** Width of the image in pixels */
  width: number;
  /** URL to the image */
  url: string;
};

/**
 * A reference to an image, with all its versions and a blurhash.
 */
export type ImageSource = {
  /** Blurhash of the image, see blurha.sh for more information */
  blurhash: string;
  /** All the versions of this image */
  views: readonly ImageView[];
};
