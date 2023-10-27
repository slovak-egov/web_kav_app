const locales = require('./locales.json');

module.exports = {
  i18n: {
    defaultLocale: 'sk',
    locales: locales,
    localeDetection: false
  },
  reloadOnPrerender: true
};
