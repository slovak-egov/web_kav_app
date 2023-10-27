import { Layout, LoadingPage } from 'components/layout';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import Head from 'next/head';
import { PathObject } from 'pages';
import { getGeneralData } from 'utils/api';
import { useTranslation } from 'next-i18next';
import useLoading from 'utils/useLoading';
import { Feedback } from 'components';

function FeedbackPage({ layoutData, menuData, path, nodeEvent, version }) {
  const { loading } = useLoading();
  const { t } = useTranslation('common');

  const title = t('feedback.title');

  return (
    <Layout
      data={layoutData}
      menuHeader={menuData.header}
      menuFooter={{ main: menuData.footer, aside: menuData.footerAside }}
      localesAliases={path.entity.aliases}
      breadcrumbs={!loading && [{ title, alias: t('url.feedback') }]}
      className="tb1:pb-8 min-h-[66vh]"
      title={!loading && title}
      perex={!loading && <span>{t('feedback.subtitle')}</span>}
      grayTitleBg={true}
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
          <Feedback
            configurationItemId={process.env.NEXT_PUBLIC_MODUL_CIID}
            originCiId={'c3b81d2359df4defb473852e28c072bc'}
            identityId={'34ed36c93e2f451ea6851cd0ac8eeae7'}
            relatedCiId={'f8155f25f44d49f9ab74adabd1900f1a'}
            feedbackApiBaseUrl="/api/gw/feedback"
            className="mt-8 print:hidden"
          />
        </div>
      ) : (
        <LoadingPage />
      )}
    </Layout>
  );
}

export async function getStaticProps(context) {
  const generalData = await getGeneralData(context);

  const path = { entity: { aliases: {} } } as PathObject;
  context.locales.forEach((localeId) => {
    switch (localeId) {
      case 'en':
        path.entity.aliases[localeId] = '/feedback';
        break;
      default:
        path.entity.aliases[localeId] = '/nahlasenie-podnetu';
        break;
    }
  });
  return {
    props: {
      ...generalData,
      path,
      ...(await serverSideTranslations(context.locale || 'sk', ['common', 'labels']))
    }
  };
}

export default FeedbackPage;
