import { encode } from 'blurhash';

export const imageSourceLoader =
  (field: string) =>
  async ({ args }: { args: { [key: string]: string } }) => ({
    // We need to get the first upload in the field, because files always return an array
    [field]: await generateImageSource(args[field]?.[0]),
  });

export const generateImageSource = async (src: string | null) => {
  if (!src) return null;
  const image = await loadImage(src);
  const { data, width, height } = getImageData(image);
  const blurhash = encode(data, width, height, 4, 4);
  return {
    blurhash,
    views: [{ url: src, height: image.height, width: image.width }],
  };
};

const loadImage = async (src: string): Promise<HTMLImageElement> =>
  new Promise((resolve, reject) => {
    const img = new window.Image();
    img.onload = () => resolve(img);
    img.onerror = (...args) => reject(args);
    img.src = src;
  });

const getImageData = (image: HTMLImageElement) => {
  const ratio = image.width / image.height;
  const width = ratio >= 1 ? 100 : 100 / ratio;
  const height = ratio <= 1 ? 100 : 100 / ratio;
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const context = canvas.getContext('2d');
  if (!context) throw new Error('Could not get canvas context');
  context.drawImage(image, 0, 0, width, height);
  return context.getImageData(0, 0, width, height);
};
