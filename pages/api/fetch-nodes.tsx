import { drupal } from 'utils/drupal';
import { NextApiRequest, NextApiResponse } from 'next';
import { JsonApiResource } from 'next-drupal';
import { handleServerErrorToLog } from 'utils/logs';

export default async function handler(request: NextApiRequest, response: NextApiResponse) {
  if (request.method === 'POST') {
    try {
      const responseFromDrupal = await drupal.getResourceCollection<JsonApiResource>(
        'node--' + request.body.params['views-argument[0]'],
        {
          defaultLocale: request.body.defaultLocale,
          locale: request.body.locale,
          params: {
            page: {
              offset:
                request.body.params.page === 0
                  ? 0
                  : (request.body.params.page - 1) * request.body.params['items-per-page'],
              limit: request.body.params['items-per-page']
            }
          },
          deserialize: false
        }
      );
      // const responseFromDrupal = await drupal.getView<JsonApiResource>('content_embed--embed', {
      //   params: request.body.params,
      //   defaultLocale: request.body.defaultLocale,
      //   locale: request.body.locale
      // });
      response.status(200).json(responseFromDrupal);
    } catch (error: any) {
      handleServerErrorToLog(error);
      response.status(error?.statusCode ?? 500).json({ message: 'Error while fetching CMS.' });
    }
  } else {
    response.status(405).send('GET method now allowed');
  }
}
