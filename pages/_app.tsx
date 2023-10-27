import React, { useEffect, useState } from 'react';
import { AppProps } from 'next/app';
import { appWithTranslation } from 'next-i18next';

import 'styles/index.css';
import { GoogleAnalytics } from 'nextjs-google-analytics';
import TagManager from 'react-gtm-module';
import { deleteCookie, getCookie, getCookies } from 'cookies-next';

import Router from 'next/router';
import { syncDrupalPreviewRoutes } from 'next-drupal';
import { getDomainShortName } from 'utils/utils';

Router.events.on('routeChangeStart', function (path) {
  syncDrupalPreviewRoutes(path);
});

function MyApp({ Component, pageProps }: AppProps) {
  const cookies = getCookies();
  const cookiesList = Object.keys(cookies);
  const gtmId = process.env.NEXT_PUBLIC_GTM_MEASUREMENT_ID;
  const gaId = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;

  const [closedEvents, setClosedEvents] = useState<string[]>([]);

  const setClosedEvent = (id: string) => {
    if (!closedEvents.includes(id)) {
      setClosedEvents([...closedEvents, id]);
    }
  };

  useEffect(() => {
    if (gtmId !== undefined) {
      TagManager.initialize({ gtmId: gtmId });
    }
  }, [gtmId]);

  useEffect(() => {
    // Remove all additionally created cookies.
    if (!getCookie('kav.sk-analytics')) {
      cookiesList.map(
        (cookie) => cookie.match(/^_ga/) && deleteCookie(cookie, { domain: getDomainShortName() })
      );
    }
    if (!getCookie('kav.sk-preferences')) {
      cookiesList.map((cookie) => cookie.match(/^kav.sk-event/) && deleteCookie(cookie));
    }
  }, [cookiesList]);

  return (
    <>
      <Component {...pageProps} nodeEvent={{ setClosedEvent }} />
      {!!getCookie('kav.sk-analytics') && <GoogleAnalytics gaMeasurementId={gaId} trackPageViews />}
    </>
  );
}

export default appWithTranslation(MyApp);
