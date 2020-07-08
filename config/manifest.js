module.exports = function() {
  return {
    name: 'Kitsu',
    short_name: 'Kitsu',
    start_url: '/?utm_source=web_app_manifest',
    display: 'standalone',
    orientation: 'portrait',
    background_color: '#332532',
    theme_color: '#332532',
    icons: [
      {
        src: '/android-chrome-192x192.png',
        sizes: '192x192',
        type: 'image/png'
      },
      {
        src: '/android-chrome-512x512.png',
        sizes: '512x512',
        type: 'image/png'
      },
      {
        src: '/apple-touch-icon.png',
        sizes: '180x180',
        type: 'image/png',
        targets: ['apple']
      }
    ],
    related_applications: [
      {
        platform: 'play',
        id: 'com.everfox.animetrackerandroid'
      }
    ]
  };
};
