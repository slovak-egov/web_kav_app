import React from 'react';

import { SecondaryNavigation as Container } from '@eslovensko/idsk-react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { useTranslation } from 'next-i18next';

import { parseFromDrupal } from 'utils/utils';

interface SecondaryNavigationProps {
  data: {
    title1: string;
    title2: string;
    triggerLink1: string;
    triggerLink2: string;
    triggerLink1Short: string;
    triggerLink2Short: string;
    text1: string;
    text2: string;
  };
  localesAliases: Record<string, string>;
}

export default function SecondaryNavigation({ data, localesAliases }: SecondaryNavigationProps) {
  const { locales, locale } = useRouter();
  const { t } = useTranslation('common');

  const getLanguageLinks = (
    allLocales: string[],
    currentLocale: string | undefined
  ): React.ReactElement<typeof Link>[] => {
    return allLocales
      ?.filter((l) => l !== currentLocale)
      .map((l) => (
        <Link href={localesAliases?.[l] ?? '/'} locale={l} key={l}>
          <a lang={l}>{t(`language.${l}`)}</a>
        </Link>
      ));
  };

  return (
    <Container
      id="secondary-navigation"
      heading={data.triggerLink1}
      headingButton={data.triggerLink2}
      mobileHeading={data.triggerLink1Short}
      mobileHeadingButton={data.triggerLink2Short}
      dropDownTitle={t(`language.${locale}`)}
      dropDownOptions={getLanguageLinks(locales || [], locale)}
    >
      <div
        id="secondary-navigation-body"
        className="grid grid-cols-1 gap-4 tb2:grid-cols-2 tb2:gap-8"
      >
        <div>
          <h3 className="idsk-text-body-1">{data.title1}</h3>
          <div className="py-2.5">{parseFromDrupal(data.text1)}</div>
        </div>
        <div>
          <h3 className="idsk-text-body-1">{data.title2}</h3>
          <div className="py-2.5">{parseFromDrupal(data.text2)}</div>
        </div>
      </div>
    </Container>
  );
}
