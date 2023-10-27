import { DrupalClient } from 'next-drupal';
import { DrupalClientOptions } from 'next-drupal/src/types';
import crossFetch from 'cross-fetch';
import { httpsAgent } from './api';
import { getBaseUrl } from './utils';

const options: DrupalClientOptions = {
  previewSecret: process.env.NEXT_PREVIEW_SECRET
};

if (!!process.env.CONSUMER_CLIENT_ID && !!process.env.CONSUMER_CLIENT_SECRET) {
  options.auth = {
    clientId: process.env.CONSUMER_CLIENT_ID,
    clientSecret: process.env.CONSUMER_CLIENT_SECRET
  };
  options.withAuth = true;
}

if (!!process.env.NEXT_DRUPAL_DEBUG && process.env.NEXT_DRUPAL_DEBUG === 'true') {
  options.debug = true;
}

if (process.env.BUILDER_MODE !== 'true') {
  const customFetcher = (url, opt) => {
    const fetcherOpts = { ...opt };
    if (process.env.AUTH_API_CLIENT_VERIFY === 'true') {
      fetcherOpts.agent = httpsAgent;
    }
    return crossFetch(url, fetcherOpts);
  };

  options.fetcher = customFetcher;
}

export const drupal = new DrupalClient(
  !!getBaseUrl('DRUPAL')
    ? `${getBaseUrl('DRUPAL')}/${process.env.DRUPAL_API_PATH_PREFIX ?? 'cms-api'}`
    : 'https://cms-slovensko-sk.lndo.site',
  options
);
