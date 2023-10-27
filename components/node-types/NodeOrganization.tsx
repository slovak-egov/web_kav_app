import React, { useRef, useState } from 'react';
import { useTranslation } from 'next-i18next';
import { TextSignpost } from '@eslovensko/idsk-react';
import Link from 'next/link';
import dynamic from 'next/dynamic';
import { NodeNoticeTeaser } from './NodeNotice';
import { NodeNewsTeaser } from './NodeNews';
import {
  OrganizationContact,
  ContactType,
  getPrimaryContacts,
  GridLayout,
  ScrollTo,
  scrollToAction
} from 'components';
import classNames from 'classnames';
import { parseFromDrupal, parseLinks } from 'utils/utils';
import NodeTeaser from '../NodeTeaser';
import NodeDates from 'components/NodeDates';

function NodesSection({ type, nodes }) {
  const { t } = useTranslation('common');
  const nodesScroll = useRef<HTMLDivElement>(null);
  const [showAllNodes, setShowAllNodes] = useState<boolean>(false);
  const nodesNumToShow = 3;

  const DynamicNodeArticleTeaser = dynamic(
    () => import('components/node-types/NodeArticle').then((mod) => mod.NodeArticleTeaser),
    { ssr: false } // Disable SSR for the NodeArticleTeaser component
  );

  if (!!nodes?.length) {
    return (
      <section className="flex flex-col gap-5 mb-5">
        <ScrollTo ref={nodesScroll} />
        <h2>{t('organization.' + type)}</h2>
        {nodes?.slice(0, showAllNodes ? nodes?.length : nodesNumToShow).map((node) => {
          switch (type) {
            case 'notices':
              return <NodeNoticeTeaser key={node.drupal_internal__nid} node={node} />;
            case 'news':
              return <NodeNewsTeaser key={node.drupal_internal__nid} node={node} />;
            case 'articles':
              return <DynamicNodeArticleTeaser key={node.drupal_internal__nid} node={node} />;
            default:
              return <NodeTeaser key={node.drupal_internal__nid} node={node} />;
          }
        })}
        {nodes?.length > nodesNumToShow && (
          <a
            className="idsk-link-l block cursor-pointer"
            onClick={() => {
              if (showAllNodes) scrollToAction(nodesScroll);
              setShowAllNodes((p) => !p);
            }}
            tabIndex={0}
            href="javascript:;"
            aria-label={`${t('organization.' + type)} - ${
              showAllNodes ? t('show_less') : t('show_more')
            }`}
          >
            {showAllNodes ? t('show_less') : t('show_more')}
          </a>
        )}
      </section>
    );
  } else {
    return null;
  }
}

export default function NodeOrganization({ node }) {
  const { t } = useTranslation('common');

  const notices = node.notices;
  const news = node.news;
  const articles = node.articles;
  const services = node.services;

  const getNodeHref = (linkNode): string => {
    return linkNode.path?.alias ? linkNode.path.alias : '/node/' + linkNode.drupal_internal__nid;
  };

  interface OrganizationAddress {
    primary: boolean;
    formatted_address: string;
  }

  const getAddressLines = (organizationUnitNode): string[] => {
    const addresses: OrganizationAddress[] = organizationUnitNode?.physical_address || [];
    const primaryAddresses = addresses.filter((addr) => addr.primary);
    return primaryAddresses?.length ? primaryAddresses[0].formatted_address.split('\n') : [];
  };

  const renderOrganizationIdNumbers = () => {
    const cin = node.field_organizational_unit?.corporate_body_id?.cin;
    const tin = node.field_organizational_unit?.corporate_body_id?.tin;
    const vat = node.field_organizational_unit?.corporate_body_id?.vat;

    return (
      <>
        {!!cin && <p className="idsk-text-body-1">{t('organization.id_numbers.cin', { cin })}</p>}
        {!!tin && <p className="idsk-text-body-1">{t('organization.id_numbers.tin', { tin })}</p>}
        {!!vat && <p className="idsk-text-body-1">{t('organization.id_numbers.vat', { vat })}</p>}
      </>
    );
  };

  const [showAllServices, setShowAllServices] = useState<boolean>(false);
  const servicesNumToshow = 3;
  const servicesScroll = useRef<HTMLDivElement>(null);

  return (
    <GridLayout
      layout="67-33"
      className="tb2:grid-cols-1 dm1:grid-cols-[minmax(0,2fr)_minmax(0,1fr)]"
    >
      <div className="flex flex-col gap-8">
        <NodesSection type="notices" nodes={notices} />
        <NodesSection type="news" nodes={news} />
        <NodesSection type="articles" nodes={articles} />

        {!!services?.length && (
          <section className="flex flex-col gap-8">
            <ScrollTo ref={servicesScroll} />
            <h2>{t('organization.services_and_forms')}</h2>
            <p className="idsk-subtitle">
              {t('organization.services_and_forms.subtitle', {
                organization_code: node.field_organizational_unit?.code
              })}
            </p>
            {services
              .slice(0, showAllServices ? services?.length : servicesNumToshow)
              .map((serviceNode) => {
                return (
                  <Link
                    href={getNodeHref(serviceNode)}
                    key={serviceNode.drupal_internal__nid}
                    passHref
                  >
                    <TextSignpost heading={serviceNode.title}>
                      {serviceNode.field_perex?.value}
                    </TextSignpost>
                  </Link>
                );
              })}
            {services?.length > servicesNumToshow && (
              <a
                className="idsk-link-l block cursor-pointer -mt-3"
                onClick={() => {
                  if (showAllServices) scrollToAction(servicesScroll);
                  setShowAllServices((p) => !p);
                }}
                tabIndex={0}
                href="javascript:;"
                aria-label={`${t('organization.services_and_forms')} - ${
                  showAllServices ? t('show_less') : t('show_more')
                }`}
              >
                {showAllServices ? t('show_less') : t('show_more')}
              </a>
            )}
          </section>
        )}
      </div>

      <aside>
        <div className="dm1:border-l border-neutral-300 dm1:pl-6">
          <div className="flex flex-col gap-10">
            <div>
              <h2 className="idsk-headline-3">{t('organization.contact')}</h2>
              <p className="idsk-text-body-1 py-1">{node.field_organizational_unit?.name}</p>
              <div className="idsk-text-body-1 pb-1">
                {getAddressLines(node.field_organizational_unit).map((line, index) => (
                  <p key={index}>{line}</p>
                ))}
              </div>
              <div className="idsk-text-body-1 pb-2.5">
                {getPrimaryContacts(node.field_organizational_unit).map((contact) => (
                  <p key={contact.id}>
                    <OrganizationContact
                      contact={contact}
                      className={contact.type == ContactType.WebsiteUrl ? 'idsk-link-s' : undefined}
                    />
                  </p>
                ))}
              </div>
              {renderOrganizationIdNumbers()}
            </div>
            <ServiceHours node={node} />
          </div>
        </div>
      </aside>
      <div className="mb-8 tb1:mb-20 mt-5">
        <NodeDates node={node} />
      </div>
    </GridLayout>
  );
}

interface HoursDayProps {
  intervals?: string[];
  dayOfWeek: number;
}

const HoursDay = ({ intervals = [], dayOfWeek }: HoursDayProps) => {
  const { t } = useTranslation('common');
  const isEmpty = !intervals.length;

  if (!isEmpty && intervals.length === 1) intervals.push(t('organization.services_hours.closed'));
  const trClasses = classNames('idsk-text-body border-t border-t-neutral-300');
  const tdClasses = classNames('py-4 px-2.5 first:max-w-[25%]');
  return (
    <tr className={trClasses}>
      <td className={tdClasses}>
        <p className="font-bold">{t(`day_in_week.short_${dayOfWeek}`)}</p>
      </td>
      {!isEmpty ? (
        intervals.slice(0, 2).map((interval, j) => (
          <td className={tdClasses} key={j}>
            {interval}
          </td>
        ))
      ) : (
        <td className={tdClasses} colSpan={2}>
          {t('organization.services_hours.office_closed')}
        </td>
      )}
    </tr>
  );
};

const ServiceHours = ({ node }) => {
  return (
    <>
      {!!node?.field_organizational_unit?.service_hours_categories?.length &&
        node.field_organizational_unit.service_hours_categories
          .filter((category) => !!category?.service_hours?.length)
          .map((category) => {
            const serviceHours = Array(5).fill(null);
            category.service_hours.forEach((hours) => (serviceHours[hours.day_of_week] = hours));
            return (
              <div className="border-b border-b-neutral-300" key={category.id}>
                <h2
                  className={classNames('idsk-headline-3', {
                    'pb-5': !category?.description,
                    'pb-2.5': !!category?.description
                  })}
                >
                  {category.name}
                </h2>
                {!!category?.description?.processed && (
                  <div className="pb-5 idsk-text-body">
                    {parseFromDrupal(category.description.processed, {
                      parserOptions: parseLinks
                    })}
                  </div>
                )}
                <table className="table-auto w-full">
                  <tbody>
                    {serviceHours.map((hours, index) => (
                      <HoursDay
                        intervals={hours?.time_intervals
                          ?.filter(
                            (interval) =>
                              interval?.interval_type?.resourceIdObjMeta
                                ?.drupal_internal__target_id === '1'
                          )
                          .map((interval) => `${interval.time_from} - ${interval.time_to}`)}
                        key={index}
                        dayOfWeek={index}
                      />
                    ))}
                  </tbody>
                </table>
              </div>
            );
          })}
    </>
  );
};
