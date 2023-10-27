import { Feed } from 'feed';
import { getGeneralData } from 'utils/api';
import { drupal } from 'utils/drupal';
import { handleServerErrorToLog } from 'utils/logs';
import { BASIC_RESOURCE_TYPES as RESOURCE_TYPES } from './[...slug]';
import { DrupalJsonApiParams } from 'drupal-jsonapi-params';

function RssPage() {}

export async function getServerSideProps(context) {
  const { res } = context;
  const generalData = await getGeneralData(context);

  const rssData: { [key: string]: any } = { results: [] };

  const params = new DrupalJsonApiParams();
  params
    .addFilter('langcode', 'CURRENT_LANGCODE')
    .addSort('changed', 'DESC')
    .addFilter('field_rss', '1')
    .addPageLimit(20);
  RESOURCE_TYPES.forEach((type) => {
    params.addFields(type, ['title', 'field_perex', 'path', 'drupal_internal__nid', 'changed']);
  });

  try {
    await Promise.all(
      RESOURCE_TYPES.map(async (type) => {
        const result = await drupal.getResourceCollectionFromContext(type, context, {
          params: params.getQueryObject()
        });
        rssData.results = [...rssData.results, ...result];
      })
    );
  } catch (e) {
    handleServerErrorToLog(e);
  }

  rssData.results.sort((a, b) => {
    if (a.changed > b.changed) {
      return -1;
    }
    if (a.changed < b.changed) {
      return 1;
    }
    return 0;
  });

  const siteTitle = generalData.layoutData.headerLogoTitle || '';
  const siteURL = process.env.SERVER_BASE_URL || 'https://www.kav.sk';
  const date = new Date();

  const feed = new Feed({
    id: siteURL,
    title: siteTitle,
    description: generalData.layoutData.headerLogoSubtitle,
    link: siteURL,
    language: context.locale || context.defaultLocale || 'sk',
    generator: siteTitle,
    copyright: `${date.getFullYear()} ${siteTitle}`
  });

  const localePrefix = context.locale === context.defaultLocale ? '' : `/${context.locale}`;

  rssData.results.slice(0, 20).forEach((node) => {
    const url = `${siteURL}${localePrefix}${
      node?.path?.alias ?? '/node/' + node?.drupal_internal__nid
    }`;
    feed.addItem({
      title: node.title,
      link: url,
      description: node?.field_perex?.processed ?? '',
      date: new Date(node.changed)
    });
  });

  if (res) {
    res.setHeader('Content-Type', 'application/rss+xml; charset=utf-8');
    res.end(feed.rss2().toString());
  }
  return {
    props: {}
  };
}

export default RssPage;
