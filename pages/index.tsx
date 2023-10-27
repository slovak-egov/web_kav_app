import Head from 'next/head';
import { GetStaticPropsResult } from 'next';
import { DrupalNode, DrupalMenuLinkContent, DrupalTranslatedPath } from 'next-drupal';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';

import { drupal } from 'utils/drupal';
import { getGeneralData, processFieldComponents } from 'utils/api';
import { Layout, LoadingPage } from 'components/layout';
import { NodeList } from 'components';
import NodeBasicPage from 'components/node-types/NodeBasicPage';
import { Loader, SearchBar } from '@eslovensko/idsk-react';
import { useState } from 'react';
import { useTranslation } from 'next-i18next';
import { useRouter } from 'next/router';
import useLoading from 'utils/useLoading';
import { NodeMetaTags, processNodeTitle } from 'utils/utils';
import classNames from 'classnames';
import { nodePageIncludes } from './[...slug]';

export type PathObject = DrupalTranslatedPath & {
  entity: { aliases; breadcrumbs };
};
export type MenuData = {
  header: DrupalMenuLinkContent[];
  footer: DrupalMenuLinkContent[];
  footerAside: DrupalMenuLinkContent[];
};

export interface PageProps {
  layoutData: DrupalNode;
  menuData: MenuData;
  path: PathObject;
  nodeEvent?: {
    events: { [key: string]: any };
    setClosedEvent: (id: string) => void;
  };
  version?: string;
  serverBaseUrl?: string;
}

interface IndexPageProps extends PageProps {
  node: DrupalNode | DrupalNode[];
}

export default function IndexPage({
  node,
  layoutData,
  menuData,
  path,
  nodeEvent,
  version,
  serverBaseUrl
}: IndexPageProps) {
  const [searchPhrase, setSearchPhrase] = useState<string>('');
  const [searchError, setSearchError] = useState<boolean>(false);
  const [fetching, setFetching] = useState<boolean>(false);
  const { loading } = useLoading();

  const { t } = useTranslation('common');
  const router = useRouter();

  const handleSearchAction = () => {
    setFetching(true);
    if (searchPhrase.length < 3) {
      setSearchError(true);
      setFetching(false);
      return;
    }
    router.push(`${t('url.search')}?kluc=${searchPhrase}`);
  };

  const searchByEnterClick = (event) => {
    if (event.key === 'Enter') {
      handleSearchAction();
    }
  };

  const headTitle = layoutData.frontPageNode
    ? processNodeTitle({ node })
    : 'Konsolidovaná analytická vrstva';

  return (
    <Layout
      data={layoutData}
      menuHeader={menuData.header}
      menuFooter={{ main: menuData.footer, aside: menuData.footerAside }}
      localesAliases={path.entity.aliases}
      breadcrumbs={!loading && (!!path.entity.breadcrumbs ? path.entity.breadcrumbs : [])}
      title={!loading && t('home_page.title')}
      perex={
        !loading && (
          <div className="flex justify-center">
            <SearchBar
              label={t('search_container.title')}
              buttonLabel={
                !fetching ? (
                  <span className="hidden dm1:inline">{t('search_container.search_label')}</span>
                ) : (
                  <Loader spinnerClassName="h-6" />
                )
              }
              onChange={(e) => {
                setSearchPhrase(e.currentTarget.value);
                if (e.currentTarget.value.length >= 3) {
                  setSearchError(false);
                }
              }}
              buttonOnClick={handleSearchAction}
              error={searchError}
              errorMsg={t('search_container.empty_error')}
              onKeyDown={searchByEnterClick}
              placeholder={t('search_container.main_placeholder')}
              containerClassName="max-w-[48rem] w-full"
              wrapperClassName="w-auto flex-grow"
              fullWidth
            />
          </div>
        )
      }
      grayTitleBg={!layoutData?.frontPageImage}
      titleLayoutFull={true}
      titleClassNames="text-center pt-9 !pb-24"
      showSearchbar={true}
      nodeEvent={nodeEvent}
      cookieSettings={layoutData?.cookiesSettings}
      version={version}
      heroImgBg={layoutData?.frontPageImage}
      contentClassName={classNames({ 'mt-10': layoutData?.frontPageImage })}
    >
      <Head>
        <title>{headTitle}</title>
        {!!layoutData.frontPageNode ? (
          <NodeMetaTags node={node} serverBaseUrl={serverBaseUrl} />
        ) : (
          <meta name="description" content="Konsolidovaná analytická vrstva" />
        )}
      </Head>
      {!!layoutData.frontPageNode ? (
        !loading ? (
          <NodeBasicPage node={node} data={layoutData} />
        ) : (
          <LoadingPage />
        )
      ) : !loading ? (
        <div>
          <NodeList nodes={node} tags={[]} nodeType="article" parentWidth="2/3" />
        </div>
      ) : (
        <LoadingPage />
      )}
    </Layout>
  );
}

export async function getStaticProps(context): Promise<GetStaticPropsResult<IndexPageProps>> {
  const generalData = await getGeneralData(context);
  let node;

  if (!!generalData.layoutData.frontPageNode) {
    node = await drupal.getResource<DrupalNode>(
      'node--page',
      generalData.layoutData.frontPageNode,
      {
        params: {
          include: nodePageIncludes
        },
        locale: context.locale,
        defaultLocale: context.defaultLocale
      }
    );
  } else {
    node = await drupal.getResourceCollectionFromContext<DrupalNode[]>('node--article', context, {
      params: {
        'filter[status]': 1,
        include: 'field_image,field_tags,uid',
        sort: '-created'
      }
    });
  }

  await processFieldComponents(node?.field_components, context);

  const path = { entity: { aliases: {} } } as PathObject;
  context.locales.map((localeId) => {
    path.entity.aliases[localeId] = '/';
  });

  return {
    props: {
      node,
      ...generalData,
      path,
      serverBaseUrl: process.env.SERVER_BASE_URL ?? 'https://www.kav.sk',
      ...(await serverSideTranslations(context.locale || 'sk', ['common', 'labels']))
    }
  };
}
