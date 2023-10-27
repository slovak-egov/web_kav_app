import { Layout, LoadingPage } from 'components/layout';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import Head from 'next/head';
import { PathObject } from 'pages';
import { getGeneralData, getSitemapData } from 'utils/api';
import { useTranslation } from 'next-i18next';
import useLoading from 'utils/useLoading';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import axios from 'axios';

function displayList(items) {
  return (
    <ul>
      {items.map((item) => (
        <li key={item.id}>
          {!!item?.url ? (
            <Link href={item.url}>
              <a
                className="idsk-link-m"
                target={item.url?.[0] !== '/' || item.url === '/rss' ? '_blank' : undefined}
              >
                {item.title}
              </a>
            </Link>
          ) : (
            <span>{item.title}</span>
          )}
          {!!item?.items?.length && displayList(item.items)}
        </li>
      ))}
    </ul>
  );
}

function SitemapPage({ layoutData, menuData, sitemapData, path, nodeEvent, version }) {
  const { loading } = useLoading();
  const { t } = useTranslation('common');
  const [tt, setTT] = useState([]);

  const title = t('sitemap.title');

  useEffect(() => {
    axios
      .get(`${process.env.NEXT_PUBLIC_DRUPAL_BASE_URL}sitemap.xml`)
      .then((test) => {
        const parser = new DOMParser();
        const xmlDoc = parser.parseFromString(test.data, 'text/xml');
        const x = xmlDoc.getElementsByTagName('loc');
        const tempUrl: any = [];
        for (let i = 0; i < x.length; i++) {
          const url = x[i].textContent?.replace(
            process.env.NEXT_PUBLIC_DRUPAL_BASE_URL + '',
            window.location.origin + '/'
          );
          tempUrl.push({ id: i, title: url, url: url });
        }
        setTT(tempUrl);
      })
      .catch(() => {});
  }, []);

  return (
    <Layout
      data={layoutData}
      menuHeader={menuData.header}
      menuFooter={{ main: menuData.footer, aside: menuData.footerAside }}
      localesAliases={path.entity.aliases}
      breadcrumbs={!loading && [{ title, alias: '/mapa-stranok' }]}
      className="tb1:pb-8 min-h-[66vh]"
      title={!loading && title}
      perex={!loading && <span>{t('sitemap.subtitle')}</span>}
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
          {/* {!!sitemapData?.length ? displayList(sitemapData) : t('sitemap.empty')} */}
          {!!tt?.length ? displayList(tt) : t('sitemap.empty')}
        </div>
      ) : (
        <LoadingPage />
      )}
    </Layout>
  );
}

export async function getStaticProps(context) {
  const generalData = await getGeneralData(context);
  const sitemapData = await getSitemapData(context);

  const path = { entity: { aliases: {} } } as PathObject;
  context.locales.forEach((localeId) => {
    switch (localeId) {
      case 'en':
        path.entity.aliases[localeId] = '/sitemap';
        break;
      default:
        path.entity.aliases[localeId] = '/mapa-stranok';
        break;
    }
  });
  return {
    props: {
      ...generalData,
      sitemapData,
      path,
      ...(await serverSideTranslations(context.locale || 'sk', ['common', 'labels']))
    }
  };
}

export default SitemapPage;
