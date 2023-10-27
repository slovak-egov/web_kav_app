const yaml = require('js-yaml');
var fs = require('fs');

const locales = Object.values({ ...require(`../locales.json`) });
const {
  i18n: { defaultLocale }
} = require('../next-i18next.config');

(function () {
  if (!locales.includes(defaultLocale)) {
    throw new Error('Invalid locales.json file.');
  }
  const translations = {};
  locales.map((locale) => {
    try {
      translations[locale] = { ...require(`../public/locales/${locale}/common.json`) };
    } catch (e) {
      console.log(`common.json file of ${locale} have not been found.`);
      translations.locale = {};
    }
  });

  const yamlTranslations = {};
  for (const phrase in translations[defaultLocale]) {
    if (translations[defaultLocale].hasOwnProperty(phrase)) {
      const phraseTranslations = {};
      locales.map((locale) => {
        if (translations[locale][phrase])
          phraseTranslations[locale] = [translations[locale][phrase]];
      });
      yamlTranslations[phrase] = phraseTranslations;
    }
  }

  const yamlFileName = 'translations.svksk_ui_translation.yml';
  fs.writeFile(`./${yamlFileName}`, yaml.safeDump(yamlTranslations), (err) => {
    if (err) throw err;
    console.log(`${yamlFileName} is created successfully.`);
  });
})();
