import { ModalSideBar, NotificationCard, PrimaryButton } from '@eslovensko/idsk-react';
import axios from 'axios';

import { useTranslation, TFunction } from 'next-i18next';
import { useEffect, useState } from 'react';
import { useMounted } from 'utils/useMounted';
import { handleClientErrorToLog } from 'utils/utils';

const getActions = (notification, t: TFunction) => {
  if (!notification.actions?.length) {
    return undefined;
  }

  const decisionUrl = process.env.NEXT_PUBLIC_ROZHODNUTIA_APP_BASE_URL;

  const sortedActions = notification.actions.sort((a: any, b: any) => {
    if (a.type === 'OPEN_WEB_VIEW') {
      return -1;
    } else if (b.type === 'OPEN_WEB_VIEW') {
      return 1;
    } else {
      return 0;
    }
  });

  const actions = sortedActions.map((action) => {
    const label = t(action.buttonStringKey || action.type, { ns: 'labels' });

    if (action.buttonStringKey === 'PERMISSION_GRANT') {
      const partnerIdType = action.requestBody?.partnerId?.type || '';
      const partnerIdValue = action.requestBody?.partnerId?.value || '';
      const decisionId = action.target?.split('/decisions/')[1].split('/permissions')[0] || '';

      if (!!decisionId.length && !!decisionUrl) {
        const href = `${decisionUrl}/rozhodnutie/${decisionId}?name=${partnerIdValue}&type=${partnerIdType}`;
        return { label, href };
      }

      return { label, href: `${decisionUrl}/404` };
    }

    return { label, href: action.target || `${decisionUrl}/404` };
  });

  return actions;
};

export default function NotificationSideBar({ opened, toggleOpened, setAlert }) {
  const { t } = useTranslation('common');

  const handleShowAllClick = () => {
    toggleOpened(false);
    window.location.href = `${process.env.NEXT_PUBLIC_MOJE_SLOVENSKO_APP_BASE_URL}/upozornenia`;
  };

  const [items, setItems] = useState<any[]>([]);
  const isMounted = useMounted();

  useEffect(() => {
    const getNotifications = async () => {
      try {
        const response = await axios.get(`/api/gw/pacho/notifications`);
        if (isMounted()) {
          setItems(response.data.items);
          setAlert(!!response.data.items.length);
        }
      } catch (e) {
        handleClientErrorToLog(e);
      }
    };
    getNotifications();
  }, []);

  return (
    <ModalSideBar
      id="layout-modal"
      opened={opened}
      toggleOpened={toggleOpened}
      heading={t('notifications')}
      footer={
        <PrimaryButton size="large" onClick={handleShowAllClick}>
          {t('show_more')}
        </PrimaryButton>
      }
      focusLockProps={{ disabled: !opened }}
    >
      {!!items?.length ? (
        items.map((item) => {
          return (
            <NotificationCard
              id={item.id}
              key={item.id}
              title={item.title}
              date={item.createdAt}
              actions={getActions(item, t)}
              highlighted={item.state === 'UNREAD'}
              className="!rounded-none !border-x-0 !border-t-0"
            >
              {item.messageBodyPrivate || item.messageBodyPublic ? (
                <p>{item.messageBodyPrivate || item.messageBodyPublic}</p>
              ) : null}
            </NotificationCard>
          );
        })
      ) : (
        <p className="text-alert-positive p-5 flex items-center justify-center idsk-text-body-1">
          {t('notifications.empty')}
        </p>
      )}
    </ModalSideBar>
  );
}
