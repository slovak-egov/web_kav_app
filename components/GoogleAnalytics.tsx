import { useEffect } from 'react';

export default function GoogleAnalytics(props: any) {
  function gtag(..._par) {
    // eslint-disable-next-line prefer-rest-params
    if ((window as any).dataLayer) (window as any).dataLayer.push(arguments);
    else (window as any).dataLayer = [];
  }

  useEffect(() => {
    const script = document.createElement('script');
    script.src =
      'https://www.googletagmanager.com/gtag/js?id=' + process.env.NEXT_PUBLIC_REACT_APP_GA_CODE;
    script.async = true;
    document.body.appendChild(script);
    gtag('js', new Date());
    gtag('config', process.env.NEXT_PUBLIC_REACT_APP_GA_CODE);
  }, []);

  return <>{props.children}</>;
}
