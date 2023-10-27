import { PrimaryButton, SecondaryButton, TextButton } from '@eslovensko/idsk-react';
import { Trans, useTranslation } from 'next-i18next';
import { useEffect, useState } from 'react';
import { getCookie, setCookie } from 'cookies-next';
import classNames from 'classnames';
import Link from 'next/link';
import { useRouter } from 'next/router';

export default function CookieBar({ settingsPage }) {
  const router = useRouter();
  const cookie = getCookie('kav.sk');
  const [stateCookie, setStateCookie] = useState(cookie);
  const [loading, setLoading] = useState<boolean>(true);
  const [consented, setConsented] = useState<boolean>(false);
  const { t } = useTranslation('common');

  const cookieMainClases = classNames('idsk-page-layout__content', {
    hidden: !!consented
  });
  const cookieConsentedClases = classNames('idsk-page-layout__content', {
    hidden: !consented
  });

  const LinkedTranslation = (props) => {
    return (
      <Link href={props.href}>
        <a className="idsk-link-m">{props.children}</a>
      </Link>
    );
  };

  function cookieSet(consent) {
    const expires = new Date();
    expires.setDate(expires.getDate() + 90);
    setCookie('kav.sk', consent, {
      expires
    });
    if (!!consent) {
      setCookie('kav.sk-analytics', consent, {
        expires
      });
      setCookie('kav.sk-preferences', consent, {
        expires
      });
    }
    setStateCookie(getCookie('kav.sk'));
  }

  useEffect(() => {
    setStateCookie(cookie);
    setLoading(false);
  }, [cookie]);

  return (
    <>
      {!loading && (stateCookie === undefined || (stateCookie !== undefined && !!consented)) && (
        <div className="fixed bottom-0 bg-neutral-100 w-screen print:hidden py-8 z-[100] shadow-[0_-8px_44px_-10px_rgba(0,0,0,0.25)]">
          <div className={cookieMainClases}>
            <h2 className="idsk-headline-3 pb-5">{t('cookies_consent.title')}</h2>
            <p className="idsk-text-body pb-3">{t('cookies_consent.subtitle1')}</p>
            <p className="idsk-text-body pb-5">{t('cookies_consent.subtitle2')}</p>
            <div className="flex flex-col dm1:flex-row gap-5">
              <PrimaryButton
                type="button"
                label={t('cookies_consent.button_consent')}
                onClick={() => {
                  cookieSet(true);
                  setConsented(true);
                }}
              />
              <PrimaryButton
                type="button"
                label={t('cookies_consent.button_dissent')}
                onClick={() => {
                  cookieSet(false);
                  setConsented(true);
                }}
              />
              <TextButton
                type="button"
                className="dm1:ml-auto"
                label={t('cookies_consent.button_settings')}
                onClick={() => !!settingsPage && router.push(settingsPage)}
              />
            </div>
          </div>
          <div className={cookieConsentedClases}>
            <p className="idsk-text-body pb-5">
              {!!stateCookie ? (
                <Trans
                  i18nKey="cookies_consent.consented"
                  components={{
                    page: <LinkedTranslation href={!!settingsPage ? settingsPage : '#'} />
                  }}
                />
              ) : (
                <Trans
                  i18nKey="cookies_consent.dissented"
                  components={{
                    page: <LinkedTranslation href={!!settingsPage ? settingsPage : '#'} />
                  }}
                />
              )}
            </p>
            <SecondaryButton
              type="submit"
              variant="basic"
              label={t('cookies_consent.button_close')}
              onClick={() => {
                setConsented(false);
                router.reload();
              }}
            />
          </div>
        </div>
      )}
    </>
  );
}
