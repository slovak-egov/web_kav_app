import { handleServerErrorToLog } from 'utils/logs';
import { DrupalNode, DrupalTaxonomyTerm, DrupalMenuLinkContent } from 'next-drupal';
import { drupal } from './drupal';
import {
  fieldComponent,
  paragraphView,
  relatedContentView,
  relatedFAQ
} from './process-field-components';
import { nodeArticle, nodeOrganization } from './process-node-types';
import { getVersion } from './version';
import https, { AgentOptions } from 'https';
import fs from 'fs';
import { localStorage } from 'utils/local-storage';

export async function getGeneralData(context): Promise<any> {
  const defaultLocale = context.defaultLocale ?? 'sk';
  const locale = context.locale ?? 'sk';
  const generalDataJSON = localStorage.getItem('generalData');
  const generalData = !!generalDataJSON ? JSON.parse(generalDataJSON) : {};
  const version = getVersion();

  if (!!generalData[locale]) {
    generalData[locale].version = version;
    return generalData[locale];
  }

  const layoutData = await drupal.getResourceCollectionFromContext<DrupalNode>(
    'config--general',
    context
  );

  if (!!layoutData.cookiesSettingsNode) {
    const cookiesSettings = await drupal.getResource<DrupalNode>(
      'node--page',
      layoutData.cookiesSettingsNode
    );
    layoutData['cookiesSettings'] = cookiesSettings?.path?.alias;
  }

  const options = { defaultLocale: defaultLocale, locale: locale };
  const menuHeader = await drupal.getMenu('main', options).catch((e) => {
    handleServerErrorToLog(e);
    return { tree: [] };
  });
  const menuFooter = await drupal.getMenu('footer', options).catch((e) => {
    handleServerErrorToLog(e);
    return { tree: [] };
  });
  const menuFooterAside = await drupal.getMenu('footer-aside', options).catch((e) => {
    handleServerErrorToLog(e);
    return { tree: [] };
  });

  return {
    layoutData,
    version,
    menuData: {
      header: filterMenuByLangCode(menuHeader.tree, locale),
      footer: filterMenuByLangCode(menuFooter.tree, locale),
      footerAside: filterMenuByLangCode(menuFooterAside.tree, locale)
    }
  };
}

export async function getSitemapData(context) {
  const options = { defaultLocale: context.defaultLocale, locale: context.locale };
  const sitemap = await drupal
    .getResourceCollectionFromContext<DrupalMenuLinkContent[]>('sitemap--general', options)
    .catch((e) => {
      handleServerErrorToLog(e);
      return [];
    });

  const data = drupal.buildMenuTree(sitemap);

  return data.items ?? [];
}

export function filterLangCode(response, langCode) {
  if (response?.length && !!langCode) {
    return response.filter((entry) => entry.langcode === langCode);
  }

  return response;
}

function filterMenuByLangCode(menu, langCode) {
  const filteredMenu: any[] = [];

  for (const item of menu) {
    if (item.items) {
      const filteredChildren = filterMenuByLangCode(item.items, langCode);

      if (filteredChildren.length > 0) {
        const itemWithFilteredChildren = { ...item, items: filteredChildren };
        filteredMenu.push(itemWithFilteredChildren);
      }
    } else if (!item.langcode || item.langcode === langCode) {
      filteredMenu.push(item);
    }
  }
  return filteredMenu;
}

export async function getTaxonomyData(taxonomyTerm: string, context, options = {}) {
  const response = await drupal.getResourceCollectionFromContext<DrupalTaxonomyTerm>(
    'taxonomy_term--' + taxonomyTerm,
    context,
    options
  );

  return filterLangCode(response, context.locale);
}

export async function processFieldComponents(field_components, context) {
  if (!field_components?.length) return;

  await Promise.all(
    field_components.map((component) => {
      switch (component.type) {
        case 'paragraph--layout_section':
          return processFieldComponents(component.paragraph_childs, context);
        case 'paragraph--view':
          return paragraphView(component, context);
        case 'paragraph--related_content':
          return relatedContentView(component, context);
        case 'paragraph--organization_search':
          return relatedContentView(
            component,
            context,
            'field_organizational_unit,field_organizational_unit.contact'
          );
        case 'paragraph--faq':
          return Promise.all([fieldComponent(component, context)]).then(() => {
            return relatedFAQ(component, context);
          });
        case 'paragraph--accordion':
          return Promise.all([fieldComponent(component, context)]).then(() => {
            return processFieldComponents(component.field_components, context);
          });
        default:
          return fieldComponent(component, context);
      }
    })
  );
}

function replaceTermInText(text, terms) {
  let newText = text;
  terms.forEach((term) => {
    newText = newText.replace(term, `<a href="${term.id}" class="">${term.name}</a>`);
  });
  return newText;
}

export async function processTextTerms(resource) {
  const terms = await drupal.getResourceCollection('term--term');

  const modifiedResource = JSON.parse(JSON.stringify(resource));

  if (modifiedResource.field_components && Array.isArray(modifiedResource.field_components)) {
    modifiedResource.field_components.forEach((item) => {
      if (item.type === 'paragraph--text') {
        const newFieldContent = { ...item.field_content };
        newFieldContent.processed = replaceTermInText(newFieldContent.processed, terms);
        newFieldContent.value = replaceTermInText(newFieldContent.value, terms);
        item.field_content = newFieldContent;
      }
    });
  }

  return modifiedResource;
}

export async function processNodeTypes(resource, context) {
  if (!resource) return;

  switch (resource.type) {
    case 'node--news':
    case 'node--article':
      await nodeArticle(resource, context);
      break;
    case 'node--organization':
      await nodeOrganization(resource, context);
      break;
  }
}

const getAgentOptions = (): AgentOptions => {
  const options: AgentOptions = {
    rejectUnauthorized: process.env.AUTH_API_CLIENT_VERIFY === 'true'
  };
  if (process.env.AUTH_API_CLIENT_CA) {
    options.ca = fs.readFileSync(process.env.AUTH_API_CLIENT_CA);
  }
  return options;
};
export const httpsAgent = new https.Agent(getAgentOptions());
