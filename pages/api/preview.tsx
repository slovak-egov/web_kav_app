import { NextApiRequest, NextApiResponse } from 'next';

import { drupal } from 'utils/drupal';

export default async function handler(request: NextApiRequest, response: NextApiResponse) {
  if (typeof request?.query?.slug === 'string')
    request.query.slug = request.query.slug.split('?')[0];
  return drupal.preview(request, response);
}
