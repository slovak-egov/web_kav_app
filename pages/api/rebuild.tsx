import { NextApiRequest, NextApiResponse } from 'next';
import { drupal } from 'utils/drupal';
import { getCurrentTimestamp, getRebuildStatus } from 'utils/utils';
import { handleServerErrorToLog } from 'utils/logs';
import { RESOURCE_TYPES } from 'pages/[...slug]';
import { i18n } from 'next-i18next.config';
import { localStorage } from 'utils/local-storage';
import { getGeneralData } from 'utils/api';

const REBUILD_STATE_RUNNING = 'running';

export default async function handler(request: NextApiRequest, response: NextApiResponse) {
  const secret = request.query.secret;

  // Validate secret.
  if (secret !== process.env.NEXT_REBUILD_SECRET) {
    return response.status(401).json({ message: 'Invalid secret.' });
  }

  const rebuildState = localStorage.getItem('rebuildState');
  if (rebuildState === REBUILD_STATE_RUNNING) {
    return response
      .status(201)
      .json({ message: 'Already rebuilding.', rebuild_status: getRebuildStatus(localStorage) });
  }

  const context = {
    defaultLocale: i18n.defaultLocale,
    locales: i18n.locales
  };
  const params = {
    'filter[langcode]': 'CURRENT_LANGCODE'
  };
  let pathsFetchFailed = false;
  const paths = await drupal
    .getStaticPathsFromContext(RESOURCE_TYPES, context, { params: params })
    .catch(() => {
      pathsFetchFailed = true;
    });

  // Stream was already closed because of error
  if (pathsFetchFailed) {
    return response.status(500).json({ message: 'Failed to fetch paths from JSON:API.' });
  }

  localStorage.setItem('rebuildState', REBUILD_STATE_RUNNING);
  localStorage.setItem('rebuildLastStartedTimestamp', getCurrentTimestamp());
  localStorage.setItem('rebuildLastStartedBy', request.query.uid ?? null);

  if (!Array.isArray(paths)) {
    return response.status(500).json({ message: 'There are no paths to rebuild.' });
  }

  const pathsCollection = paths.map((path) => {
    let slug = '';
    if (typeof path !== 'string') {
      slug = `${
        path.locale !== i18n.defaultLocale ? `/${path.locale}` : ''
      }/${path?.params?.slug.join('/')}`;
    } else {
      slug = path;
    }
    return slug.toString();
  });

  // Invalidate static paths defined in next.js
  pathsCollection.push('/');

  // Revalidate frontpage for all locales
  context.locales.forEach((locale) => {
    // Skip default locale since default homepage is already in pathsCollection
    if (locale === i18n.defaultLocale) {
      return;
    }
    pathsCollection.push(`/${locale}`);
  });

  const generalData = {};
  context.locales.map(async (locale) => {
    generalData[locale] = await getGeneralData({
      defaultLocale: i18n.defaultLocale,
      locale: locale
    });
  });
  localStorage.setItem('generalData', JSON.stringify(generalData));

  pathsCollection.push('/mapa-stranok');
  pathsCollection.push('/en/sitemap');
  pathsCollection.push('/vyhladavanie');
  pathsCollection.push('/en/search');
  pathsCollection.push('/slovnik-pojmov');
  pathsCollection.push('/en/terms');
  pathsCollection.push('/nahlasenie-podnetu');
  pathsCollection.push('/feedback');

  response.status(200).json({
    message: 'Rebuild started...',
    rebuild_status: getRebuildStatus(localStorage)
  });

  // Set progress to 4 since we've already revalidated frontpage
  let progress = 0;
  localStorage.setItem('rebuildLastCount', paths.length);
  localStorage.setItem('rebuildLastProgress', progress);

  const skipPaths = ['/rss'];
  for (const slug of pathsCollection) {
    progress++;
    localStorage.setItem('rebuildLastProgress', progress);

    // We should skip whitelisted paths to avoid errors while revalidated non-static route.
    if (skipPaths.indexOf(slug) > -1) {
      continue;
    }

    try {
      await response.revalidate(slug);
    } catch (error) {
      handleServerErrorToLog(error);
    }
  }

  // Reset current rebuild progress and store data to finished.
  localStorage.setItem('rebuildFinishedTimestamp', getCurrentTimestamp());
  localStorage.setItem('rebuildFinishedBy', localStorage.getItem('rebuildLastStartedBy') ?? null);
  localStorage.removeItem('rebuildState');
  localStorage.removeItem('rebuildLastStartedTimestamp');
  localStorage.removeItem('rebuildLastStartedBy');
  localStorage.removeItem('rebuildLastCount');
  localStorage.removeItem('rebuildLastProgress');
  localStorage.removeItem('generalData');
}
