import { Checkbox, Loader, PrimaryButton } from '@eslovensko/idsk-react';
import { useTranslation } from 'next-i18next';
import { deleteCookie, getCookies, hasCookie, setCookie } from 'cookies-next';
import { useFormik } from 'formik';
import { getDomainShortName } from 'utils/utils';
import { useRouter } from 'next/router';
import { useState } from 'react';

export default function CookieSettings() {
  const cookies = getCookies();
  const cookiesList = Object.keys(cookies);
  const { t } = useTranslation('common');
  const router = useRouter();
  const [loading, setLoading] = useState<boolean>(false);

  const expires = new Date();
  expires.setDate(expires.getDate() + 90);

  const formik = useFormik({
    initialValues: {
      analytics: cookies['kav.sk-analytics'] === 'true',
      preferences: cookies['kav.sk-preferences'] === 'true'
    },
    onSubmit: (values) => {
      setLoading(true);
      if (!hasCookie('kav.sk')) {
        setCookie('kav.sk', 'true', {
          expires
        });
      }
      setCookie('kav.sk-analytics', values.analytics.toString(), {
        expires
      });
      if (!values.analytics) {
        cookiesList.map(
          (cookie) => cookie.match(/^_ga/) && deleteCookie(cookie, { domain: getDomainShortName() })
        );
      }
      setCookie('kav.sk-preferences', values.preferences.toString(), {
        expires
      });
      if (!values.preferences) {
        cookiesList.map((cookie) => cookie.match(/^kav.sk-event/) && deleteCookie(cookie));
      }
      router.reload();
    }
  });

  return (
    <form className="flex flex-col py-8" onSubmit={formik.handleSubmit}>
      <div className="flex-auto">
        <div className="pb-8">
          <h2 className="pb-4">{t('cookies_settings.necessary_title')}</h2>
          <Checkbox
            id="necessary-cookies"
            name="necessary"
            label={t('cookies_settings.necessary_content')}
            inputSize="large"
            checked
            disabled
          />
        </div>
        <div className="pb-8">
          <h2 className="pb-4">{t('cookies_settings.analytics_title')}</h2>
          <Checkbox
            id="analytics-cookies"
            name="analytics"
            label={t('cookies_settings.analytics_content')}
            inputSize="large"
            onChange={formik.handleChange}
            checked={formik.values.analytics}
          />
        </div>
        <div className="pb-8">
          <h2 className="pb-4">{t('cookies_settings.preferences_title')}</h2>
          <Checkbox
            id="preferences-cookies"
            name="preferences"
            label={t('cookies_settings.preferences_content')}
            inputSize="large"
            onChange={formik.handleChange}
            checked={formik.values.preferences}
          />
        </div>
        <PrimaryButton type="submit" disabled={loading}>
          {!loading ? t('cookies_settings.button_save') : <Loader spinnerClassName="h-6" />}
        </PrimaryButton>
      </div>
    </form>
  );
}
