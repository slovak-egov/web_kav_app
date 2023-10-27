import { handleServerErrorToLog } from 'utils/logs';
import { JsonApiResource } from 'next-drupal';
import { drupal } from './drupal';
import { filterLangCode } from './api';

export async function paragraphView(component, context) {
  const options = { defaultLocale: context.defaultLocale, locale: context.locale };
  try {
    const response = await drupal.getView<JsonApiResource>('content_embed--embed', {
      params: {
        'views-argument[0]':
          component.field_content_type.resourceIdObjMeta.drupal_internal__target_id,
        'items-per-page': component.field_items_per_page,
        page: 0,
        include: 'field_tags'
      },
      ...options
    });
    component.data = response.results;
    component.dataTotalCount = response.meta.count;
  } catch (e) {
    handleServerErrorToLog(e);
    component.data = [];
    component.dataTotalCount = 0;
  }

  try {
    component.tags = (
      await drupal.getView<JsonApiResource>('content_tags--embed', {
        params: {
          'views-argument[0]':
            component.field_content_type.resourceIdObjMeta.drupal_internal__target_id
        },
        ...options
      })
    ).results;
  } catch (e) {
    handleServerErrorToLog(e);
    component.tags = [];
  }
}

export async function relatedContentView(component, context, includeFields = '') {
  const options: { [key: string]: any } = {
    defaultLocale: context.defaultLocale,
    locale: context.locale
  };
  const loadNode = async (id: string, type: string) => {
    try {
      let articleFields = 'field_tags,field_image.field_media_image';

      if (!!includeFields) {
        articleFields = articleFields + ',' + includeFields;
      }

      options.params = {
        include: type === 'node--news' || type === 'node--article' ? articleFields : includeFields
      };

      return await drupal.getResource<JsonApiResource>(type, id, options);
    } catch (e) {
      handleServerErrorToLog(e);
      return [];
    }
  };

  try {
    const relatedContent = await Promise.all(
      component.field_node_reference.map(({ id, type }) => loadNode(id, type))
    );

    component.relatedContent = filterLangCode(relatedContent, context.locale);
  } catch (e) {
    handleServerErrorToLog(e);
    component.relatedContent = [];
  }
}

export async function relatedFAQ(component, context) {
  const options = {
    defaultLocale: context.defaultLocale,
    locale: context.locale
  };

  const loadFAQ = async (id: string, type: string) => {
    try {
      return await drupal.getResource<JsonApiResource>(type, id, options);
    } catch (e) {
      handleServerErrorToLog(e);
      return [];
    }
  };

  try {
    let nodes;

    if (component.field_selection_type === 'reference') {
      nodes = await Promise.all(
        component.field_faq_reference.map(({ id, type }) => loadFAQ(id, type))
      );
    } else {
      const res = await drupal.getView<JsonApiResource>('faqs_embed--faq', {
        params: {
          'views-filter[field_category_target_id]':
            component.field_category.resourceIdObjMeta.drupal_internal__target_id
        },
        ...options
      });
      nodes = res.results;
    }
    component.relatedFAQ = nodes?.filter(({ langcode }) => langcode === context.locale);
  } catch (e) {
    handleServerErrorToLog(e);
    component.relatedFAQ = [];
  }
}

export async function fieldComponent(component, context) {
  if (!!component?.drupal_internal__id) {
    return;
  } else {
    const options: { [key: string]: any } = {
      defaultLocale: context.defaultLocale,
      locale: context.locale
    };

    const includeParams = (type) => {
      switch (type) {
        case 'paragraph--attachments':
          return `field_attachment_media.field_media_documents,
            field_attachment_media.field_media_image`;
        case 'paragraph--image':
          return 'field_image.field_media_image,field_content_reference';
        case 'paragraph--link':
        case 'paragraph--info_banner':
          return 'field_content_reference';
        default:
          return '';
      }
    };

    try {
      const componentHelper = await drupal.getResource<JsonApiResource>(
        component.type,
        component.id,
        {
          params: {
            include: includeParams(component.type)
          },
          ...options
        }
      );

      const keys = Object.keys(componentHelper);
      keys.map((key) => {
        component[key] = componentHelper[key];
      });
    } catch (e) {
      handleServerErrorToLog(e);
    }
  }
}
