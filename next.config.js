const { i18n } = require('./next-i18next.config');
const { version } = require('./package.json');
let crypto = require('crypto');
const { LocalStorage } = require('node-localstorage');
const drupalBaseUrl = `${process.env.DRUPAL_BASE_URL}/${process.env.DRUPAL_API_PATH_PREFIX}`
  .replace(/^https?:\/\//, '')
  .replace(/\/.*$/, '');
let localStorage = new LocalStorage('./public/localStorage/build_data');

// Reset build states in localStorage on start
localStorage.removeItem('rebuildState');
localStorage.removeItem('rebuildLastStartedTimestamp');
localStorage.removeItem('rebuildLastStartedBy');
localStorage.removeItem('rebuildLastCount');
localStorage.removeItem('rebuildLastProgress');

module.exports = {
  i18n,
  publicRuntimeConfig: {
    version
  },
  images: {
    domains: [process.env.NEXT_MEDIA_DOMAIN, drupalBaseUrl, 's3.skit.brainit.tech']
  },
  distDir: process.env.BUILD_DIR || '.next/current',
  experimental: {
    isrMemoryCacheSize: 0
  },
  webpack: (config) => {
    config.module.rules.push({
      test: /\.svg$/i,
      issuer: /\.[jt]sx?$/,
      use: [
        {
          loader: '@svgr/webpack',
          options: { dimensions: false, replaceAttrValues: { '#000': 'currentColor' } }
        }
      ]
    });
    return config;
  },
  webpackDevMiddleware: (config) => {
    config.watchOptions = {
      poll: 800,
      aggregateTimeout: 300
    };
    return config;
  },
  generateBuildId: () => {
    if (!!process.env.NEXT_BUILD_ID) {
      return process.env.NEXT_BUILD_ID;
    }
    // In case env variable LAST_COMMIT_SHORT_SHA is not defined generate random hash
    return crypto.randomBytes(20).toString('hex');
  },
  async rewrites() {
    return [
      {
        source: '/sitemap',
        destination: '/mapa-stranok'
      },
      {
        source: '/terms',
        destination: '/slovnik-pojmov'
      },
      {
        source: '/search',
        destination: '/vyhladavanie'
      },
      {
        source: '/feedback',
        destination: '/nahlasenie-podnetu'
      }
    ];
  }
};
