require('dotenv').config();

const axios = require('axios');
const {
  i18n: { defaultLocale }
} = require('../next-i18next.config');

function filterMenuByLangCode(menu, langCode) {
  const filteredMenu = [];

  for (const item of menu) {
    if (item.items) {
      const filteredChildren = filterMenuByLangCode(item.items, langCode);

      if (!!filteredChildren.length) {
        const itemWithFilteredChildren = { ...item, items: filteredChildren };
        filteredMenu.push(itemWithFilteredChildren);
      }
    } else if (!item.langcode || item.langcode === langCode) {
      filteredMenu.push(item);
    }
  }
  return filteredMenu;
}

const LocalStorage = require('node-localstorage').LocalStorage;
const localStorage = new LocalStorage('./public/localStorage/build_data');
const DrupalClient = require('next-drupal').DrupalClient;

const drupal = new DrupalClient(
  `${process.env.DRUPAL_BASE_URL}/${process.env.DRUPAL_API_PATH_PREFIX}`
);

(async function () {
  const generalData = {};

  try {
    const response = await axios.get(
      `${process.env.DRUPAL_BASE_URL}/${process.env.DRUPAL_API_PATH_PREFIX}/jsonapi/language/enabled`
    );

    await Promise.all(
      response.data.data.map(async (locale) => {
        const localeContext = {
          defaultLocale: defaultLocale,
          locale: locale.id
        };

        const layoutData = await drupal.getResourceCollectionFromContext(
          'config--general',
          localeContext
        );

        if (!!layoutData.cookiesSettingsNode) {
          const cookiesSettings = await drupal.getResource(
            'node--page',
            layoutData.cookiesSettingsNode
          );
          layoutData['cookiesSettings'] = cookiesSettings?.path?.alias;
        }

        const menuHeader = await drupal.getMenu('main', localeContext);
        const menuFooter = await drupal.getMenu('footer', localeContext);
        const menuFooterAside = await drupal.getMenu('footer-aside', localeContext);

        generalData[locale.id] = {
          layoutData,
          menuData: {
            header: filterMenuByLangCode(menuHeader.tree, locale.id),
            footer: filterMenuByLangCode(menuFooter.tree, locale.id),
            footerAside: filterMenuByLangCode(menuFooterAside.tree, locale.id)
          }
        };

        console.log(`general data of ${locale.id} is created successfully.`);
      })
    );

    localStorage.setItem('generalData', JSON.stringify(generalData));
    console.log(`general data is saved successfully.`);
  } catch {
    console.error('Unable to fetch general data from CMS.');
  }
})();
