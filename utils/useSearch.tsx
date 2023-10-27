import { useTranslation } from 'next-i18next';
import { useCallback, useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/router';
import axios from 'axios';
import { handleClientErrorToLog } from 'utils/utils';
import { Pagination, TextSignpost } from '@eslovensko/idsk-react';
import Link from 'next/link';
import classNames from 'classnames';
import { ScrollTo, scrollToAction } from 'components';

interface UseSearchProps {
  url: string;
  keyInUrl?: string;
  dayFrom?: string;
  dayTo?: string;
  tag?: string;
  author?: string;
  itemsPerPage?: number;
  isAdvancedSearch?: boolean;
}

const Shimmer = () => {
  const pulseClasses = 'animate-pulse bg-neutral-300 rounded-full';
  return (
    <TextSignpost heading="">
      <div className={classNames(pulseClasses, 'w-1/2 mb-6 h-7')} />
      <div className="flex flex-col gap-2.5">
        <div className={classNames(pulseClasses, 'w-11/12 h-4')} />
        <div className={classNames(pulseClasses, 'w-full h-4')} />
        <div className={classNames(pulseClasses, 'w-5/6 h-4')} />
        <div className={classNames(pulseClasses, 'w-3/4 h-4')} />
      </div>
    </TextSignpost>
  );
};

function useSearch({
  url,
  keyInUrl = '',
  itemsPerPage = 0,
  dayFrom = '',
  dayTo = '',
  tag = '',
  author = '',
  isAdvancedSearch = false
}: UseSearchProps) {
  const router = useRouter();

  const { t } = useTranslation('common');

  const [searchResults, setSearchResults] = useState<{ [key: string]: any }[]>([]);
  const [searchError, setSearchError] = useState<boolean>(false);
  const [searchPhrase, setSearchPhrase] = useState<string>('');

  const initialLoad = useRef<boolean>(true);
  const [fetching, setFetching] = useState<boolean>(!!keyInUrl);

  const [page, setPage] = useState<number>(0);
  const [totalCount, setTotalCount] = useState<number>(0);

  const searchRef = useRef<HTMLDivElement>(null);

  const getPageCount = () => Math.ceil(totalCount / itemsPerPage);

  const fetchSearchResults = useCallback(
    // eslint-disable-next-line @typescript-eslint/no-shadow
    async (phraseToSearch, dayFrom, dayTo, tag, author, pageToFetch = 0) => {
      try {
        setFetching(true);
        const params: { [key: string]: any } = {
          searchPhrase: phraseToSearch,
          defaultLocale: !router.defaultLocale ? 'sk' : router.defaultLocale,
          locale: !router.locale ? 'sk' : router.locale
        };
        if (!!itemsPerPage) {
          params.page = pageToFetch;
          params.pageLimit = itemsPerPage;
        }
        if (!!dayFrom) {
          params.dayFrom = dayFrom;
        }
        if (!!dayTo) {
          params.dayTo = dayTo;
        }
        if (!!author) {
          params.author = author;
        }
        if (!!tag) {
          params.tag = tag;
        }
        const response = await axios.post(url, params);
        initialLoad.current = false;
        setSearchResults(response.data);
        if (!!itemsPerPage) setTotalCount(Number(response.headers?.['x-total-count']));
        setFetching(false);
      } catch (error) {
        handleClientErrorToLog(error);
      }
    },
    [itemsPerPage, router.defaultLocale, router.locale, url]
  );

  const handleSearchAction = () => {
    if (isAdvancedSearch || searchPhrase.length >= 3 || searchPhrase.length === 0) {
      if (!!dayFrom || !!dayTo || !!tag || !!author) {
        router.query.dayFrom = dayFrom;
        router.query.dayTo = dayTo;
        router.query.tag = tag;
        router.query.author = author;
      }
      if (!!keyInUrl) {
        router.query[keyInUrl] = searchPhrase;
        router.query.stranka = String(0);
        router.push(router, undefined, { scroll: false });
      }
      setPage(0);
      setSearchError(false);
      fetchSearchResults(searchPhrase, dayFrom, dayTo, tag, author, 0);
    } else {
      setSearchError(true);
    }
  };

  const searchByEnterClick = (event) => {
    if (event.key === 'Enter') {
      handleSearchAction();
    }
  };

  useEffect(() => {
    if (initialLoad.current && router.isReady && !!keyInUrl) {
      const searchPhraseFromUrl = router.query?.[keyInUrl]?.toString() ?? '';
      setSearchPhrase(searchPhraseFromUrl);
      if (searchPhraseFromUrl.length >= 3) {
        const pageFromUrl = Number(router.query?.stranka ?? 0);
        setPage(pageFromUrl);
        fetchSearchResults(searchPhraseFromUrl, dayFrom, dayTo, tag, author, pageFromUrl);
      } else {
        if (!!searchPhraseFromUrl.length && searchPhraseFromUrl.length < 3) {
          setSearchError(true);
        }
        setFetching(false);
      }
    }
  }, [router.isReady, router.query, keyInUrl, fetchSearchResults, dayFrom, dayTo, tag, author]);

  const SearchResults = ({
    className = '',
    linkStyle = false,
    renderChildren = (node) => node?.field_perex?.value
  }) => (
    <div>
      <ScrollTo ref={searchRef} />
      {!fetching ? (
        <>
          {!!searchResults.length && (
            <div className={classNames('flex flex-col gap-8', className)}>
              {searchResults.map((node, index) => {
                const linkHref = node?.path?.alias
                  ? node.path.alias
                  : '/node/' + node?.drupal_internal__nid;

                return (
                  <Link href={linkHref} key={index} passHref>
                    <TextSignpost
                      heading={node.title}
                      subtitle={node?.computed_organizational_unit_label}
                      className="last:border-0"
                      style={{ color: linkStyle ? 'red !important' : 'red !important' }}
                    >
                      {renderChildren(node)}
                    </TextSignpost>
                  </Link>
                );
              })}
            </div>
          )}
          {!initialLoad.current && !searchResults.length && (
            <p className="idsk-text-body text-alert-attention">
              {t('search_container.no_results')}
            </p>
          )}
        </>
      ) : (
        <>
          <Shimmer />
          {searchResults.slice(0, searchResults.length - 1).map((node) => (
            <Shimmer key={node?.id} />
          ))}
        </>
      )}
      {!!itemsPerPage && getPageCount() > 1 && (
        <Pagination
          className="my-8"
          pageCount={getPageCount()}
          initialPage={page + 1}
          onPageChange={(p) => {
            scrollToAction(searchRef);
            setPage(p.selected - 1);
            if (!!keyInUrl) {
              router.query.stranka = String(p.selected);
              router.replace(router, undefined, { scroll: false });
            }
            fetchSearchResults(searchPhrase, dayFrom, dayTo, tag, author, p.selected - 1);
          }}
        />
      )}
    </div>
  );

  return {
    inputProps: {
      onChange: (e) => setSearchPhrase(e.target.value),
      error: searchError,
      errorMsg: t('search_container.empty_error'),
      value: searchPhrase,
      onKeyDown: searchByEnterClick
    },
    searchPhrase,
    searchResults,
    SearchResults,
    handleSearchAction,
    fetching,
    totalCount
  };
}

export default useSearch;
