import { DrupalJsonApiParams } from 'drupal-jsonapi-params';
import { drupal } from 'utils/drupal';
import { NextApiRequest, NextApiResponse } from 'next';
import { JsonApiResource } from 'next-drupal';
import { handleServerErrorToLog } from 'utils/logs';

export default async function handler(request: NextApiRequest, response: NextApiResponse) {
  if (request.method === 'POST') {
    const params = new DrupalJsonApiParams()
      .addInclude(['field_organizational_unit', 'field_organizational_unit.contact'])
      .addFilter('langcode', 'CURRENT_LANGCODE')
      .addGroup('search_group', 'OR')
      .addFilter('title', request.body.searchPhrase, 'CONTAINS', 'search_group')
      .addFilter('field_perex.value', request.body.searchPhrase, 'CONTAINS', 'search_group');
    if (request.body.hasOwnProperty('page') && request.body.hasOwnProperty('pageLimit')) {
      params
        .addPageOffset(request.body.page * request.body.pageLimit)
        .addPageLimit(request.body.pageLimit);
    }

    try {
      const responseFromDrupal = await drupal.getResourceCollection<JsonApiResource>(
        'node--organization',
        {
          defaultLocale: request.body.defaultLocale,
          locale: request.body.locale,
          params: params.getQueryObject(),
          deserialize: false
        }
      );
      response
        .setHeader('X-Total-Count', responseFromDrupal.meta.count)
        .status(200)
        .json(drupal.deserialize(responseFromDrupal));
    } catch (error: any) {
      handleServerErrorToLog(error);
      response.status(error?.statusCode ?? 500).json({ message: 'Error while fetching CMS.' });
    }
  } else {
    response.status(405).send('GET method now allowed');
  }
}
