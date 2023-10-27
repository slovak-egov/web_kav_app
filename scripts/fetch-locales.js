require('dotenv').config();

var fs = require('fs');
const axios = require('axios');
const {
  i18n: { defaultLocale }
} = require('../next-i18next.config');

const parseTranslationFromDrupal = (data) => {
  const formattedTranslation = {};
  data.map((phrase) => {
    formattedTranslation[phrase.attributes.key] = phrase.attributes.value;
  });
  return formattedTranslation;
};

(async function () {
  let locales = ['sk', 'en'];

  try {
    const response = await axios.get(
      `${process.env.DRUPAL_BASE_URL}/${process.env.DRUPAL_API_PATH_PREFIX}/jsonapi/language/enabled`
    );
    locales = response.data.data.map((locale) => locale.id);

    const localesLabels = {};
    response.data.data.map((locale) => {
      localesLabels[`language.${locale.id}`] = locale.attributes.label;
    });

    response.data.data.map(async (locale) => {
      let translations = {};

      try {
        translations = { ...require(`../public/locales/${locale.id}/common.json`) };
      } catch (e) {
        console.log(`common.json file of ${locale.id} translation will be created.`);
      } finally {
        try {
          const translation = await axios.get(
            `${process.env.DRUPAL_BASE_URL}/${process.env.DRUPAL_API_PATH_PREFIX}/${
              locale.id === defaultLocale ? '' : locale.id + '/'
            }jsonapi/translations/ui`
          );
          translations = { ...translations, ...parseTranslationFromDrupal(translation.data.data) };
        } catch {
          console.error(`Unable to fetch ${locale.id} translations from CMS.`);
        } finally {
          translations = { ...translations, ...localesLabels };
          fs.mkdir(`./public/locales/${locale.id}`, { recursive: true }, function (err) {
            if (err) throw err;
            fs.writeFile(
              `./public/locales/${locale.id}/common.json`,
              JSON.stringify(translations, null, 2),
              function (err) {
                if (err) throw err;
                console.log(`common.json of ${locale.id} translation is created successfully.`);
              }
            );
          });
        }
      }
    });
  } catch {
    console.error('Unable to fetch locales list from CMS.');
  } finally {
    fs.writeFile('locales.json', JSON.stringify(locales), function (err) {
      if (err) throw err;
      console.log('locales.json is created successfully.');
    });
  }
})();
