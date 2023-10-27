import { InformationBanner, InformationBannerProps } from '@eslovensko/idsk-react';
import InfoIcon from '@eslovensko/idsk-react/dist/assets/svgIcons/Actions/info.svg';
import Link from 'next/link';
import { useTranslation } from 'next-i18next';

import { getCookie, setCookie } from 'cookies-next';

export default function InfoBanner({ nodeEvent, cookiesLifespan }) {
  const { t } = useTranslation('common');

  const onClose = (id) => {
    if (!!getCookie('kav.sk-preferences')) {
      const expires = new Date();
      expires.setDate(expires.getDate() + Number(cookiesLifespan));
      setCookie(`kav.sk-event-${id}-closed`, true, { expires });
    } else {
      nodeEvent.setClosedEvent?.(id);
    }
  };

  return (
    <>
      {!!nodeEvent?.events?.length &&
        nodeEvent.events.map((event) => {
          const showEvent = !!event?.title && !getCookie(`kav.sk-event-${event.id}-closed`);
          return (
            showEvent && (
              <InformationBanner
                title={event.title}
                icon={<InfoIcon className="h-5" />}
                variant={event.field_event_category as InformationBannerProps['variant']}
                type="announcement"
                errorMessageId="event-error"
                key={event.id}
                closeButtonOnClick={() => onClose(event.id)}
                closeButtonLabel={t('menu.close')}
                ariaLabel={event.title}
                className="print:hidden"
              >
                <span className="block">{event?.field_event_description}</span>
                {!!event?.field_event_link?.url && (
                  <Link href={event.field_event_link.url} passHref>
                    <a
                      className="idsk-link-s text-primary-medium"
                      target={
                        event.field_event_link.url?.[0] !== '/' ||
                        event.field_event_link.url === '/rss'
                          ? '_blank'
                          : '_self'
                      }
                    >
                      {event.field_event_link.title || event.field_event_link.url}
                    </a>
                  </Link>
                )}
              </InformationBanner>
            )
          );
        })}
    </>
  );
}
