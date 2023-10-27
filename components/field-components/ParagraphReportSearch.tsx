import { Loader, SearchContainer } from '@eslovensko/idsk-react';
import { useTranslation } from 'next-i18next';
import useSearch from 'utils/useSearch';

export default function ParagraphReportSearch() {
  const { t } = useTranslation('common');

  const { SearchResults, inputProps, handleSearchAction, fetching, totalCount } = useSearch({
    url: '/api/fetch-reports',
    keyInUrl: 'report',
    itemsPerPage: 10
  });

  return (
    <>
      <SearchContainer
        title={t('search_container.report.title')}
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
        containerClassName="z-0"
        {...inputProps}
      />
      <p className="z-0">
        <span className="font-bold">
          {t('global_search_page.total_count_results', { count: totalCount })}
        </span>{' '}
        {t('global_search_page.of_search')}
      </p>
      <SearchResults
        renderChildren={(node) => (
          <span>
            <span style={{ color: 'gray' }}>{node.title}</span>
            <br />
            {node.field_perex?.processed}
          </span>
        )}
      />
    </>
  );
}
