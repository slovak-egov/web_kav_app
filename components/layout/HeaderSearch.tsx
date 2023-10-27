import { useState } from 'react';

import { Loader, SearchBar } from '@eslovensko/idsk-react';
import { useTranslation } from 'next-i18next';
import { useRouter } from 'next/router';

export default function HeaderSearch() {
  const { t } = useTranslation('common');
  const router = useRouter();

  const [searchError, setSearchError] = useState<boolean>(false);
  const [searchPhrase, setSearchPhrase] = useState<string>('');
  const [fetching, setFetching] = useState<boolean>(false);

  const handleSearchAction = () => {
    setFetching(true);
    if (!searchPhrase.length) {
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

  return (
    <SearchBar
      id="search-header"
      label={t(`search_container.title`)}
      containerClassName="mx-5 hidden dm1:flex"
      className="w-72 pr-10"
      searchbarSize="medium"
      placeholder={t(`header_search.placeholder`)}
      buttonOnClick={handleSearchAction}
      buttonDisabled={fetching}
      buttonLabel={fetching && <Loader spinnerClassName="h-6" />}
      buttonAriaLabel={t('search_container.search_label')}
      error={searchError}
      onChange={(e) => setSearchPhrase(e.currentTarget.value)}
      onKeyDown={searchByEnterClick}
    />
  );
}
