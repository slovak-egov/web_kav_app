import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';

function useLoading() {
  const [loading, setLoading] = useState<boolean>(false);
  const router = useRouter();

  useEffect(() => {
    const pathFromRouter = () =>
      router.defaultLocale === router.locale
        ? router.asPath.split('?')[0]
        : `/${router.locale}${router.asPath.split('?')[0]}`;

    const handleStart = (url) => url.split('?')[0] !== pathFromRouter() && setLoading(true);

    const handleComplete = () => setLoading(false);

    router.events.on('routeChangeStart', handleStart);
    router.events.on('routeChangeComplete', handleComplete);
    router.events.on('routeChangeError', handleComplete);

    return () => {
      router.events.off('routeChangeStart', handleStart);
      router.events.off('routeChangeComplete', handleComplete);
      router.events.off('routeChangeError', handleComplete);
    };
  }, [router]);

  return {
    loading
  };
}

export default useLoading;
