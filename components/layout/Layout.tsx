import {
  PreviewAlert,
  Footer,
  Header,
  InfoBanner,
  TitleSection,
  CookieBar
} from 'components/layout';
import Image from 'next/image';
import { ReCaptchaProvider } from 'next-recaptcha-v3';
import { Breadcrumbs, PageLayout, SkipLink } from '@eslovensko/idsk-react';
import Link from 'next/link';
import classNames from 'classnames';
import { useTranslation } from 'next-i18next';
import { useRouter } from 'next/router';
import { Feedback } from 'components';
import GoogleAnalytics from 'components/GoogleAnalytics';

export default function Layout({
  children,
  data,
  menuHeader,
  menuFooter,
  localesAliases,
  breadcrumbs,
  className = '',
  contentClassName = '',
  title,
  perex,
  grayTitleBg = false,
  heroImgBg = false,
  titleLayoutFull = false,
  titleClassNames = '',
  showSearchbar = true,
  nodeEvent,
  cookieSettings = '',
  version = ''
}) {
  const { isPreview } = useRouter();
  const { t } = useTranslation('common');

  const crumbs =
    !!breadcrumbs?.length &&
    breadcrumbs?.map((crumb, index) =>
      crumb.alias !== '#' ? (
        <Link href={crumb.alias} key={index}>
          <a>{crumb.title}</a>
        </Link>
      ) : (
        <span key={index}>{crumb.title}</span>
      )
    );
  const bread = !!breadcrumbs?.length && (
    <Breadcrumbs
      homeLink={
        <Link href="/">
          <a>{t('menu.home')}</a>
        </Link>
      }
    >
      {crumbs}
    </Breadcrumbs>
  );

  const layoutClasses = classNames(
    'bg-white pb-0',
    {
      'overflow-x-hidden': grayTitleBg
    },
    className
  );

  const isBrowser = () => typeof window !== 'undefined';

  return (
    <ReCaptchaProvider reCaptchaKey={process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY}>
      <GoogleAnalytics />
      <PreviewAlert />
      {!isPreview && isBrowser() && window.top === window.self && (
        <CookieBar settingsPage={cookieSettings} />
      )}
      <SkipLink href="#main-content">{t('skip_link')}</SkipLink>
      <PageLayout
        id="main-content"
        informationBanner={
          <InfoBanner nodeEvent={nodeEvent} cookiesLifespan={data?.cookiesLifespan ?? 1} />
        }
        header={
          <Header
            data={{
              title1: data.egovHeaderTitle1,
              title2: data.egovHeaderTitle2,
              triggerLink1: data.egovHeaderTriggerLink1,
              triggerLink2: data.egovHeaderTriggerLink2,
              triggerLink1Short: data.egovHeaderTriggerLink1Short,
              triggerLink2Short: data.egovHeaderTriggerLink2Short,
              text1: data.egovHeaderText1.value,
              text2: data.egovHeaderText2.value
            }}
            logo={{
              logoSrc: data.headerLogo,
              logoTitle: t('title'),
              logoTitleShort: data.headerLogoTitleShort,
              logoSubtitle: data.headerLogoSubtitle,
              logoSubtitleShort: data.headerLogoSubtitleShort
            }}
            menu={menuHeader}
            localesAliases={localesAliases}
            showSearchbar={showSearchbar}
          />
        }
        footer={
          <>
            <Feedback
              originCiId={'af6259626ecc4b2890019fc99710e69a'}
              identityId={'b16c21319e6542139869647104374745'}
              relatedCiId={'5d773f8caea54d028b05ffb678714840'}
              configurationItemId={process.env.NEXT_PUBLIC_MODUL_CIID}
              configurationReportItemId={data.feedbackFormReportUUID}
              feedbackApiBaseUrl="/api/gw/feedback"
              blueBanner
            />
            <Footer
              data={{ text: data.footerClaim.value, logoAlt: data.headerLogoTitle }}
              menu={menuFooter}
              logoSrc={data.footerLogo}
              logoAlt={data.footerLogoAlt}
              version={version}
            />
          </>
        }
        heading={
          (!!title || !!perex) && (
            <TitleSection
              grayBg={grayTitleBg}
              title={title}
              titleWhite={!!heroImgBg}
              perex={perex}
              layoutFull={titleLayoutFull}
              className={titleClassNames}
            />
          )
        }
        className={layoutClasses}
        contentClassName={contentClassName}
        breadcrumbs={bread}
        heroImage={
          !!heroImgBg && (
            <Image
              src={data.frontPageImage}
              layout="fill"
              className="absolute object-cover inset-0"
              placeholder={!!data?.frontPageImageBlur ? 'blur' : undefined}
              blurDataURL={data?.frontPageImageBlur}
              quality={90}
            />
          )
        }
      >
        {children}
      </PageLayout>
    </ReCaptchaProvider>
  );
}
