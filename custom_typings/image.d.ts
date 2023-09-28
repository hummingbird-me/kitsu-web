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

declare module '*.png' {
  export const source: ImageSource;
}

declare module '*.jpg' {
  export const source: ImageSource;
}

declare module '*.jpeg' {
  export const source: ImageSource;
}

declare module '*.gif' {
  export const source: ImageSource;
}
