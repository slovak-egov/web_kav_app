import * as React from 'react';
import { GetStaticPathsResult, GetStaticPropsResult } from 'next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import Head from 'next/head';
import { DrupalNode } from 'next-drupal';
import dynamic from 'next/dynamic';

import { drupal } from 'utils/drupal';
import {
  getGeneralData,
  processFieldComponents,
  processNodeTypes,
  processTextTerms
} from 'utils/api';
import { PageProps, PathObject } from './index';
import { CookieSettings, Layout, LoadingPage } from 'components/layout';
import classNames from 'classnames';
import { NodeMetaTags, processNodeTitle } from 'utils/utils';
import useLoading from 'utils/useLoading';

const NodeArticle = dynamic(() => import('components/node-types/NodeArticle'));
const NodeBasicPage = dynamic(() => import('components/node-types/NodeBasicPage'));
const NodeOrganization = dynamic(() => import('components/node-types/NodeOrganization'));

export const BASIC_RESOURCE_TYPES = [
  'node--page',
  'node--news',
  'node--article',
  'node--organization'
];
export const RESOURCE_TYPES = [...BASIC_RESOURCE_TYPES];

interface NodePageProps extends PageProps {
  resource: DrupalNode;
}

export default function NodePage({
  resource,
  layoutData,
  menuData,
  path,
  nodeEvent,
  version,
  serverBaseUrl
}: NodePageProps) {
  const { loading } = useLoading();

  const grayTitleBg = resource.type !== 'node--organization' || loading;

  const isBodyWithNegativeMargin = [
    'paragraph--search_service',
    'paragraph--organization_search'
  ].includes(resource?.field_components?.[0]?.paragraph_childs?.[0]?.type);

  const title = resource?.title ?? resource?.name;
  const headTitle = processNodeTitle({ node: resource });

  if (!resource) return null;

  if (path?.entity?.breadcrumbs?.length >= 3) path.entity.breadcrumbs.splice(0, 1);

  return (
    <Layout
      data={layoutData}
      menuHeader={menuData.header}
      menuFooter={{ main: menuData.footer, aside: menuData.footerAside }}
      localesAliases={path.entity.aliases}
      breadcrumbs={!loading && path.entity.breadcrumbs}
      title={!loading && title}
      perex={!loading && resource?.field_perex?.value}
      grayTitleBg={grayTitleBg}
      contentClassName={classNames({ 'z-30': isBodyWithNegativeMargin && !loading })}
      nodeEvent={nodeEvent}
      cookieSettings={layoutData?.cookiesSettings}
      version={version}
    >
      <Head>
        <title>{headTitle}</title>
        <NodeMetaTags node={resource} serverBaseUrl={serverBaseUrl} />
      </Head>
      {loading ? (
        <LoadingPage />
      ) : (
        <>
          {resource.type === 'node--page' && <NodeBasicPage node={resource} data={layoutData} />}
          {resource.type === 'node--news' && <NodeArticle node={resource} />}
          {resource.type === 'node--article' && <NodeArticle node={resource} />}
          {resource.type === 'node--organization' && <NodeOrganization node={resource} />}
          {layoutData.cookiesSettingsNode === resource.id && <CookieSettings />}
        </>
      )}
    </Layout>
  );
}

export const nodePageIncludes = `field_components,
field_components.field_attachment_media.field_media_documents,
field_components.field_attachment_media.field_media_image,
field_components.field_image.field_media_image,
field_components.field_content_reference,
field_components.field_icon.field_svg_file`;

export async function getStaticPaths(context): Promise<GetStaticPathsResult> {
  const params = {
    'filter[langcode]': 'CURRENT_LANGCODE'
  };
  return {
    paths: await drupal.getStaticPathsFromContext(RESOURCE_TYPES, context, { params: params }),
    fallback: 'blocking'
  };
}

export async function getStaticProps(context): Promise<GetStaticPropsResult<NodePageProps>> {
  const locale = context.locale;
  const generalData = await getGeneralData(context);
  const path = (await drupal.translatePathFromContext(context)) as PathObject;
  if (!path) {
    return {
      notFound: true
    };
  }

  // Check for redirect.
  if (path.redirect?.length) {
    if (process.env.BUILD_RUNNING === '1') {
      return {
        notFound: true,
        revalidate: 5
      };
    } else {
      const [redirect] = path.redirect;
      return {
        redirect: {
          destination: redirect.to,
          permanent: redirect.status === '301'
        }
      };
    }
  }

  const type = path?.jsonapi?.resourceName;
  let params = {};
  if (type === 'node--news' || type === 'node--article') {
    params = {
      include: `field_image.field_media_image,
          uid,
          field_components,
          field_tags,
          field_components.field_attachment_media.field_media_documents,
          field_components.field_attachment_media.field_media_image,
          field_components.field_image.field_media_image,
          field_components.field_content_reference`
    };
  }
  if (type === 'node--page') {
    params = {
      include: nodePageIncludes
    };
  }

  if (type === 'node--organization') {
    params = {
      include: `field_organizational_unit,
          field_organizational_unit.corporate_body_id,
          field_organizational_unit.contact,
          field_organizational_unit.service_hours_categories,
          field_organizational_unit.physical_address`
    };
  }

  const resource = await drupal.getResourceFromContext<DrupalNode>(path, context, {
    params
  });

  if (!resource) {
    throw new Error(`Failed to fetch resource: ${path?.jsonapi?.individual}`);
  }
  if (locale !== context.locale) {
    return {
      notFound: true
    };
  }

  const modifiedResource = await processTextTerms(resource);
  await processFieldComponents(modifiedResource?.field_components, context);
  await processNodeTypes(modifiedResource, context);

  if (!context.preview && resource?.status === false) {
    return {
      notFound: true
    };
  }

  if (modifiedResource?.comments && modifiedResource?.comments?.length) {
    modifiedResource.comments = modifiedResource.comments.filter(({ status }) => !!status);
  }

  return {
    props: {
      resource: modifiedResource,
      ...generalData,
      path,
      serverBaseUrl: process.env.SERVER_BASE_URL ?? 'https://www.kav.sk',
      ...(await serverSideTranslations(context.locale || 'sk', ['common', 'labels']))
    }
  };
}
