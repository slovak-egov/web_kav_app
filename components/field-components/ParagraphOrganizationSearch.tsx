import { Loader, SearchContainer, TextSignpost } from '@eslovensko/idsk-react';
import { useTranslation } from 'next-i18next';
import Link from 'next/link';
import { OrganizationContact, getPrimaryContacts } from 'components';
import useSearch from 'utils/useSearch';

export default function ParagraphOrganizationSearch(props) {
  const { t } = useTranslation('common');

  const { relatedContent } = props;
  const relatedOrganizations = relatedContent.filter(({ type }) => type === 'node--organization');

  const { SearchResults, inputProps, handleSearchAction, fetching, totalCount } = useSearch({
    url: '/api/fetch-organizations',
    keyInUrl: 'organization',
    itemsPerPage: 10
  });

  return (
    <>
      <SearchContainer
        title={t('search_container.organization.title')}
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
          <span className="flex gap-5">
            {getPrimaryContacts(node.field_organizational_unit).map((contact) => (
              <OrganizationContact key={contact.id} contact={contact} />
            ))}
          </span>
        )}
      />
      {!!relatedOrganizations?.length && (
        <>
          <h2 className="pt-7">{t('organization.popular_contacts')}</h2>
          <div className="flex flex-col gap-8">
            {relatedOrganizations.map((node) => {
              const linkHref = node.path?.alias
                ? node.path.alias
                : '/node/' + node.drupal_internal__nid;

              return (
                <Link href={linkHref} key={node.drupal_internal__nid} passHref>
                  <TextSignpost heading={node.title}>
                    <span className="flex gap-5">
                      {getPrimaryContacts(node.field_organizational_unit).map((contact) => (
                        <OrganizationContact key={contact.id} contact={contact} />
                      ))}
                    </span>
                  </TextSignpost>
                </Link>
              );
            })}
          </div>
        </>
      )}
    </>
  );
}
