module.exports = function() {
  return {
    name: 'Kitsu',
    short_name: 'Kitsu',
    lang: 'en-US',
    dir: 'ltr',
    start_url: '/?utm_source=web_app_manifest',
    display: 'standalone',
    orientation: 'portrait',
    prefer_related_applications: true,
    related_applications: [
      {
        platform: 'itunes',
        url: 'https://apps.apple.com/app/kitsu-anime-manga-tracker/id590452826'
      },
      {
        platform: 'play',
        url: 'https://play.google.com/store/apps/details?id=com.everfox.animetrackerandroid',
        id: 'com.everfox.animetrackerandroid'
      }
    ],
    background_color: '#332532',
    theme_color: '#332532',
    ms: {
      tileColor: '#F75239'
    },
    icons: [
      {
        src: '/favicon-32x32.png',
        sizes: '32x32',
        targets: ['favicon']
      },
      {
        src: '/favicon-194x194.png',
        sizes: '194x194',
        targets: ['manifest', 'favicon']
      },
      {
        src: '/mstile-70x70.png',
        element: 'square70x70logo',
        targets: ['ms']
      },
      {
        src: '/apple-touch-icon.png',
        sizes: '180x180',
        targets: ['apple']
      },
      {
        src: '/safari-pinned-tab.svg',
        safariPinnedTabColor: '#f75239',
        targets: ['safari-pinned-tab']
      },
      {
        src: '/android-chrome-512x512.png',
        sizes: '512x512',
        targets: ['manifest']
      }
    ]
  };
};
