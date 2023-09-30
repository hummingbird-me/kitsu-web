import { createFilter, FilterPattern } from '@rollup/pluginutils';
import { encode } from 'blurhash';
import { Plugin } from 'rollup';
import sharp from 'sharp';

type PluginOptions = {
  /**
   * A minimatch pattern, or array of patterns, which specifies the files in the build the plugin
   * should operate on.
   */
  include: FilterPattern;
  /**
   * A minimatch pattern, or array of patterns, which specifies the files in the build the plugin
   * should ignore.
   */
  exclude: FilterPattern;
};

const DEFAULT_OPTIONS: PluginOptions = {
  include: /^[^?]+\.(heic|heif|avif|jpeg|jpg|png|tiff|webp|gif)(\?.*)?$/i,
  exclude: 'public/**/*',
};

export const imageMetadataPlugin = (
  userOptions: Partial<PluginOptions> = {},
): Plugin & { enforce: 'post' } => {
  const options = { ...DEFAULT_OPTIONS, ...userOptions };
  const filter = createFilter(options.include, options.exclude);

  return {
    name: 'imageMetadata',
    enforce: 'post',
    async transform(input, id) {
      if (!filter(id)) return null;

      const source = await generateImageSource(input, id);

      return `
        ${input};
        export const source = ${JSON.stringify(source)};
      `;
    },
  };
};

type ImageSource = {
  blurhash: string;
  views: [
    {
      height: number;
      width: number;
      url: string;
    },
  ];
};

const generateImageSource = async (
  input: string,
  id: string,
): Promise<ImageSource> => {
  const image = sharp(id);

  const [{ data, info }, metadata] = await Promise.all([
    image
      .raw()
      .ensureAlpha()
      .resize(64, 64, { fit: 'inside' })
      .toBuffer({ resolveWithObject: true }),
    image.metadata(),
  ]);

  const blurhash = encode(
    new Uint8ClampedArray(data),
    info.width,
    info.height,
    Math.max(Math.min(Math.floor(info.width / 16), 3), 6),
    Math.max(Math.min(Math.floor(info.height / 16), 3), 6),
  );

  const url = /export default "([^"]+)"/.exec(input)?.[1];

  return {
    blurhash,
    views: [
      {
        height: metadata.height,
        width: metadata.width,
        url,
      },
    ],
  };
};
