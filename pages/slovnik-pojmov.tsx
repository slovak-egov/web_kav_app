import { getGeneralData } from 'utils/api';
import { drupal } from 'utils/drupal';
import { DrupalJsonApiParams } from 'drupal-jsonapi-params';
import useLoading from 'utils/useLoading';
import { PathObject } from 'pages';
import { useTranslation } from 'next-i18next';
import { Layout, LoadingPage, TitleSection } from 'components/layout';
import classNames from 'classnames';
import Head from 'next/head';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { TextSignpost } from '@eslovensko/idsk-react';

function TermListPage({ layoutData, menuData, path, nodeEvent, version, termList }) {
  const { loading } = useLoading();
  const { t } = useTranslation('common');

  const title = t('terms.title');

  function displayList(items) {
    return (
      <ul key={'slovnik-pojmov'}>
        {items.map((item, itemKey) => (
          <TextSignpost key={itemKey} heading={item.name} href={`${t('url.terms')}/${item.id}`}>
            {item.description}
          </TextSignpost>
        ))}
      </ul>
    );
  }

  return (
    <Layout
      data={layoutData}
      menuHeader={menuData.header}
      menuFooter={{ main: menuData.footer, aside: menuData.footerAside }}
      localesAliases={path.entity.aliases}
      breadcrumbs={!loading && [{ title, alias: t('url.terms') }]}
      className="tb1:pb-8 min-h-[66vh]"
      contentClassName={classNames('z-30')}
      title={!loading && title}
      perex={!loading && <span>{t('terms.title')}</span>}
      grayTitleBg={true}
      showSearchbar={false}
      nodeEvent={nodeEvent}
      cookieSettings={layoutData?.cookiesSettings}
      version={version}
    >
      <Head>
        <title>{title} | KAV</title>
        <meta name="description" content="Konsolidovaná analytická vrstva" />
      </Head>
      {!loading ? (
        <div className="p-text idsk-text-body">
          <TitleSection title={title} perex={''} />
          {!!termList?.length ? displayList(termList) : t('sitemap.empty')}
        </div>
      ) : (
        <LoadingPage />
      )}
    </Layout>
  );
}

export async function getServerSideProps(context) {
  const generalData = await getGeneralData(context);

  const path = { entity: { aliases: {} } } as PathObject;

  context.locales.forEach((localeId) => {
    switch (localeId) {
      case 'en':
        path.entity.aliases[localeId] = '/terms';
        break;
      default:
        path.entity.aliases[localeId] = '/slovnik-pojmov';
        break;
    }
  });

  const params = new DrupalJsonApiParams();
  const result = await drupal.getResourceCollectionFromContext('term--term', context, {
    params: params.getQueryObject()
  });

  const termList = result.sort((a, b) => {
    if (a.name > b.name) {
      return -1;
    }
    if (a.name < b.name) {
      return 1;
    }
    return 0;
  });

  return {
    props: {
      ...generalData,
      termList,
      path,
      ...(await serverSideTranslations(context.locale || 'sk', ['common', 'labels']))
    }
  };
}

export default TermListPage;
