import { Layout, LoadingPage } from 'components/layout';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import Head from 'next/head';
import { PathObject } from 'pages';
import { getGeneralData } from 'utils/api';
import { useTranslation } from 'next-i18next';
import { DateInput, Input, Loader, SearchContainer } from '@eslovensko/idsk-react';
import useSearch from 'utils/useSearch';
import { useRouter } from 'next/router';
import classNames from 'classnames';
import useLoading from 'utils/useLoading';
import { useState } from 'react';

function SearchResultsPage({ layoutData, menuData, path, nodeEvent, version }) {
  const { loading } = useLoading();
  const { t } = useTranslation('common');

  const title = t('global_search_page.title');

  const [isAdvancedSearch, setIsAdvancedSearch] = useState(false);
  const [dayFrom, setDayFrom] = useState('');
  const [dayTo, setDayTo] = useState('');
  const [author, setAuthor] = useState('');
  const [tag, setTag] = useState('');

  const { SearchResults, inputProps, handleSearchAction, fetching, totalCount } = useSearch({
    url: '/api/fetch-global-search',
    keyInUrl: 'kluc',
    itemsPerPage: 5,
    dayFrom: isAdvancedSearch ? dayFrom : undefined,
    dayTo: isAdvancedSearch ? dayTo : undefined,
    tag: isAdvancedSearch ? tag : undefined,
    author: isAdvancedSearch ? author : undefined,
    isAdvancedSearch
  });

  const handleAdvancedClick = function () {
    setIsAdvancedSearch(!isAdvancedSearch);
  };

  const router = useRouter();

  return (
    <Layout
      data={layoutData}
      menuHeader={menuData.header}
      menuFooter={{ main: menuData.footer, aside: menuData.footerAside }}
      localesAliases={path.entity.aliases}
      breadcrumbs={!loading && [{ title, alias: t('url.search') }]}
      className="tb1:pb-8 min-h-[66vh]"
      contentClassName={classNames('z-30')}
      title={!loading && title}
      perex={
        !loading && (
          <span>{`${t('global_search_page.subtitle')} "${router.query?.kluc ?? ''}"`}</span>
        )
      }
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
        <div className="flex flex-col gap-8">
          <div className="border border-[#efefef] rounded-lg">
            <SearchContainer
              title={t('search_container.title')}
              label={t('search_container.title')}
              searchButton={{
                disabled: fetching,
                children: fetching ? (
                  <Loader spinnerClassName="h-6" />
                ) : (
                  t('search_container.search_label')
                ),
                onClick: handleSearchAction
              }}
              placeholder={t('search_container.placeholder')}
              advancedSearchButton={{
                label: isAdvancedSearch
                  ? t('search_container.advanced_search_label_hide')
                  : t('search_container.advanced_search_label'),
                onClick: handleAdvancedClick
              }}
              containerClassName="z-0 border-0"
              {...inputProps}
            />
            {isAdvancedSearch && (
              <div>
                <div className="flex pl-4">
                  <DateInput
                    id="dayFrom"
                    label={t('search_day_from')}
                    dayLabel={t('date.day')}
                    monthLabel={t('date.month')}
                    yearLabel={t('date.year')}
                    onValueUpdate={(e) => {
                      setDayFrom(e);
                    }}
                  />
                  <div className="ml-20">
                    <DateInput
                      id="dayTo"
                      label={t('search_day_to')}
                      dayLabel={t('date.day')}
                      monthLabel={t('date.month')}
                      yearLabel={t('date.year')}
                      onValueUpdate={(e) => setDayTo(e)}
                    />
                  </div>
                </div>
                <div className="pl-4 pb-3 pr-4">
                  <Input
                    id="tag"
                    fullWidth
                    label={t('search_day_tag')}
                    onChange={(e) => setTag(e.target.value)}
                  />
                  <Input
                    id="author"
                    fullWidth
                    label={t('search_day_author')}
                    onChange={(e) => setAuthor(e.target.value)}
                  />
                </div>
              </div>
            )}
          </div>

          <p className="z-0">
            <span className="font-bold">
              {t('global_search_page.total_count_results', { count: totalCount })}
            </span>{' '}
            {t('global_search_page.of_search')}
          </p>
          <SearchResults />
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
        path.entity.aliases[localeId] = '/search';
        break;
      default:
        path.entity.aliases[localeId] = '/vyhladavanie';
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

export default SearchResultsPage;
