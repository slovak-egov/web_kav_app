import { Layout, LoadingPage } from 'components/layout';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import Head from 'next/head';
import { PathObject } from 'pages';
import { getGeneralData } from 'utils/api';
import Image from 'next/image';

import errorImg from 'public/images/error_page.png';
import { useTranslation } from 'next-i18next';
import useLoading from 'utils/useLoading';

function Error({ statusCode, layoutData, menuData, path, nodeEvent, version }) {
  const { loading } = useLoading();
  const { t } = useTranslation('common');

  const errorNames = {
    401: {
      title: t('error_page.401'),
      description: t('error_page.401.description')
    },
    403: {
      title: t('error_page.403'),
      description: t('error_page.403.description')
    },
    404: {
      title: t('error_page.404'),
      description: t('error_page.404.description')
    },
    408: {
      title: t('error_page.408'),
      description: t('error_page.408.description')
    },
    500: {
      title: t('error_page.500'),
      description: t('error_page.500.description')
    },
    502: {
      title: t('error_page.502'),
      description: t('error_page.502.description')
    },
    503: {
      title: t('error_page.503'),
      description: t('error_page.503.description')
    },
    504: {
      title: t('error_page.504'),
      description: t('error_page.504.description')
    }
  };

  return (
    <Layout
      data={layoutData}
      menuHeader={menuData.header}
      menuFooter={{ main: menuData.footer, aside: menuData.footerAside }}
      localesAliases={path.entity.aliases}
      breadcrumbs={[]}
      className="tb1:pb-8 min-h-[66vh]"
      contentClassName={!loading ? 'flex items-center justify-center text-center' : ''}
      title=""
      perex=""
      nodeEvent={nodeEvent}
      cookieSettings={layoutData?.cookiesSettings}
      version={version}
    >
      <Head>
        <title>{statusCode}</title>
        <meta name="description" content="Konsolidovaná analytická vrstva" />
      </Head>
      {loading ? (
        <LoadingPage />
      ) : (
        <div className="py-24">
          <Image src={errorImg} alt="error icon" width="303" height="208" />
          {!!errorNames?.[statusCode] ? (
            <>
              <h1 className="idsk-headline-2 pt-5">
                {`${statusCode} ${errorNames[statusCode].title}`}
              </h1>
              <p className="idsk-text-body py-8 max-w-2xl relative mx-auto">
                {`${errorNames[statusCode].description}`}
              </p>
            </>
          ) : (
            <h1 className="idsk-headline-2 pt-5">{statusCode}</h1>
          )}
        </div>
      )}
    </Layout>
  );
}

export async function getServerSideProps(context) {
  const statusCode = context.res
    ? context.res.statusCode
    : context.err
    ? context.err.statusCode
    : 404;
  const generalData = await getGeneralData(context);

  const path = { entity: { aliases: {} } } as PathObject;
  context.locales.map((localeId) => {
    path.entity.aliases[localeId] = '/';
  });
  return {
    props: {
      statusCode,
      ...generalData,
      path,
      ...(await serverSideTranslations(context.locale || 'sk', ['common', 'labels']))
    }
  };
}

export default Error;
