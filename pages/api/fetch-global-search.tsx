import { DrupalJsonApiParams } from 'drupal-jsonapi-params';
import { drupal } from 'utils/drupal';
import { NextApiRequest, NextApiResponse } from 'next';
import { JsonApiResource } from 'next-drupal';
import { handleServerErrorToLog } from 'utils/logs';

export default async function handler(request: NextApiRequest, response: NextApiResponse) {
  if (request.method === 'POST') {
    try {
      const params = new DrupalJsonApiParams();
      params
        .addFilter('type', ['service', 'article', 'news', 'notice', 'page'], 'IN')
        .addFilter('fulltext', request.body.searchPhrase)
        .addFilter('langcode', request.body.locale)
        .addFilter('status', '1');

      if (request.body.hasOwnProperty('author')) {
        params.addFilter('uid_name', 'admin');
      }

      if (request.body.hasOwnProperty('dayFrom')) {
        const dayFrom = Date.parse(request.body.dayFrom) / 1000;
        params.addFilter('created', dayFrom.toString(), '>=');
      }

      if (request.body.hasOwnProperty('dayTo')) {
        const dayTo = Date.parse(request.body.dayTo) / 1000;
        params.addFilter('created', dayTo.toString(), '<');
      }

      if (request.body.hasOwnProperty('tag')) {
        params.addFilter('field_tag_name', request.body.tag);
      }

      if (request.body.hasOwnProperty('page') && request.body.hasOwnProperty('pageLimit')) {
        params
          .addPageOffset(request.body.page * request.body.pageLimit)
          .addPageLimit(request.body.pageLimit);
      }

      params
        .addFields('node--page', ['title', 'field_perex', 'path', 'drupal_internal__nid'])
        .addFields('node--news', [
          'title',
          'field_perex',
          'path',
          'drupal_internal__nid',
          'computed_organizational_unit_label',
          'created'
        ])
        .addFields('node--article', [
          'title',
          'field_perex',
          'path',
          'drupal_internal__nid',
          'computed_organizational_unit_label',
          'created'
        ]);

      const responseFromDrupal = await drupal.getSearchIndex<JsonApiResource>('content', {
        defaultLocale: request.body.defaultLocale,
        locale: request.body.locale,
        params: params.getQueryObject(),
        deserialize: false
      });
      response
        .setHeader('X-Total-Count', responseFromDrupal.meta.count)
        .status(200)
        .json(drupal.deserialize(responseFromDrupal));
    } catch (error: any) {
      handleServerErrorToLog(error);
      response.status(error?.statusCode ?? 500).json({ message: error });
    }
  } else {
    response.status(405).send('GET method now allowed');
  }
}
