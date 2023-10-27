import { getGeneralData } from 'utils/api';
import { drupal } from 'utils/drupal';
import useLoading from 'utils/useLoading';
import { PathObject } from 'pages';
import { useTranslation } from 'next-i18next';
import { Layout, LoadingPage, TitleSection } from 'components/layout';
import classNames from 'classnames';
import Head from 'next/head';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';

function TermItemPage({ layoutData, menuData, path, nodeEvent, version, result }) {
  const { loading } = useLoading();
  const { t } = useTranslation('common');

  const title = t('terms.title');

  return (
    <Layout
      data={layoutData}
      menuHeader={menuData.header}
      menuFooter={{ main: menuData.footer, aside: menuData.footerAside }}
      localesAliases={path.entity.aliases}
      breadcrumbs={
        !loading && [
          { title, alias: '/term' },
          { title: result.name, alias: `/term/${result.id}` }
        ]
      }
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
      {!loading ? <TitleSection title={result.name} perex={result.description} /> : <LoadingPage />}
    </Layout>
  );
}

export async function getServerSideProps(context) {
  const generalData = await getGeneralData(context);
  const { id } = context.params;

  const path = { entity: { aliases: {} } } as PathObject;

  context.locales.map((localeId) => {
    path.entity.aliases[localeId] = '/term';
  });

  const result = await drupal.getResource('term--term', id);

  return {
    props: {
      ...generalData,
      result,
      path,
      ...(await serverSideTranslations(context.locale || 'sk', ['common', 'labels']))
    }
  };
}

export default TermItemPage;
