import { handleServerErrorToLog } from 'utils/logs';
import { JsonApiResource } from 'next-drupal';
import { drupal } from './drupal';
import { DrupalJsonApiParams } from 'drupal-jsonapi-params';
import { getServiceLocatorData, getServiceLocatorRelatedData } from './api-services';

export async function nodeService(resource) {
  resource.organizationalUnit = [];

  try {
    if (resource?.field_organizational_unit?.id) {
      resource.organizationalUnit = await drupal.getResource<JsonApiResource>(
        `organizational_unit--organizational_unit`,
        resource?.field_organizational_unit?.id
      );

      resource.relatedContacts = [];

      if (resource.organizationalUnit?.contact) {
        try {
          resource.relatedContacts = await Promise.all(
            resource.organizationalUnit?.contact.map(({ id, type }) =>
              drupal.getResource<JsonApiResource>(type, id)
            )
          );
        } catch (e) {
          handleServerErrorToLog(e);
        }
      }
    }

    if (!!resource?.egov_service_id) {
      resource.serviceLocatorData = await getServiceLocatorData(resource.egov_service_id);
      resource.serviceLocatorProviders = await getServiceLocatorRelatedData(
        resource.egov_service_id,
        'providers'
      );
    }
  } catch (e) {
    handleServerErrorToLog(e);
  }
}

export async function nodeArticle(resource, context) {
  try {
    resource.comments = await drupal.getResourceCollectionFromContext<JsonApiResource>(
      'comment--comment',
      context,
      {
        params: {
          'filter[entity_id.id]': resource.id
        }
      }
    );
  } catch (e) {
    handleServerErrorToLog(e);
    resource.comments = [];
  }
}

export async function nodeOrganization(resource, context) {
  const params = new DrupalJsonApiParams()
    .addFilter('field_organizational_unit.id', resource.field_organizational_unit?.id, '=')
    .addFilter('langcode', 'CURRENT_LANGCODE')
    .addPageOffset(0)
    .addPageLimit(10);

  if (!!resource.field_organizational_unit?.service_hours_categories?.length) {
    try {
      await Promise.all(
        resource.field_organizational_unit.service_hours_categories.map(async (category, index) => {
          const response = await drupal.getResourceCollectionFromContext<JsonApiResource>(
            'service_hours--service_hours',
            context,
            {
              params: {
                'filter[service_hours_category_id.id]': category.id,
                include: 'time_intervals'
              }
            }
          );
          resource.field_organizational_unit.service_hours_categories[index].service_hours =
            response;
        })
      );
    } catch (e) {
      handleServerErrorToLog(e);
    }
  }

  params.addCustomParam({
    sort: {
      'sort-created': {
        path: 'created',
        langcode: context.locale || context.defaultLocale || 'sk',
        direction: 'DESC'
      }
    }
  });
  params.addInclude(['field_tags', 'field_image.field_media_image']);
  try {
    resource.articles = await drupal.getResourceCollectionFromContext<JsonApiResource>(
      `node--article`,
      context,
      {
        params: params.getQueryObject()
      }
    );
  } catch (e) {
    handleServerErrorToLog(e);
    resource.articles = [];
  }

  try {
    resource.news = await drupal.getResourceCollectionFromContext<JsonApiResource>(
      `node--news`,
      context,
      {
        params: params.getQueryObject()
      }
    );
  } catch (e) {
    handleServerErrorToLog(e);
    resource.news = [];
  }
}
