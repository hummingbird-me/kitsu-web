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

declare module '*?imageSource' {
  export const source: ImageSource;
}
