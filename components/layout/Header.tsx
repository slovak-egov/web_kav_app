import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useTranslation } from 'next-i18next';

import classNames from 'classnames';

import Image from 'next/image';
import {
  HeaderContainer as PublicHeader,
  IconLink,
  Logo,
  MenuButton,
  MenuMobile
} from '@eslovensko/idsk-react';

import { MainMenu, SecondaryNavigation, HeaderSearch } from 'components/layout';

import AppLogo from 'public/images/app_logo.svg';
import SearchIcon from '@eslovensko/idsk-react/dist/assets/svgIcons/Actions/search.svg';

export default function Header({ data, logo, menu, localesAliases, showSearchbar = true }) {
  const [mobileNavOpened, setMobileNavOpened] = useState<boolean>(false);

  const { t } = useTranslation('common');
  const router = useRouter();

  useEffect(() => {
    const handleStart = () => setMobileNavOpened(false);

    router.events.on('routeChangeStart', handleStart);

    return () => {
      router.events.off('routeChangeStart', handleStart);
    };
  }, [router.asPath, router.events]);

  return (
    <>
      <PublicHeader
        focusLock={mobileNavOpened}
        fixed={false}
        secondaryNavigation={<SecondaryNavigation data={data} localesAliases={localesAliases} />}
        largeMenu={<MainMenu fullNav={true} menu={menu} />}
        className={classNames('relative', {
          'idsk-header-container__wrapper--opened-mobile-menu': mobileNavOpened
        })}
        mobileMenu={
          <MenuMobile opened={mobileNavOpened}>
            <MainMenu label="Menu" menu={menu} />
          </MenuMobile>
        }
        logo={
          !!Object.keys(logo)?.length && (
            <Link href="/" passHref>
              <a
                className={classNames({
                  'hidden dm1:inline-block': mobileNavOpened
                })}
              >
                <Logo
                  image={
                    !!logo.logoSrc ? (
                      <div className="flex items-center">
                        <Image src={logo.logoSrc} width="40" height="40" alt={logo.logoTitle} />
                      </div>
                    ) : (
                      <AppLogo width="40" />
                    )
                  }
                  title={logo.logoTitle}
                  subtitle={logo.logoSubtitle}
                  shortTitle={logo.logoTitleShort}
                  shortSubtitle={logo.logoSubtitleShort}
                />
              </a>
            </Link>
          )
        }
      >
        <Link href={t('url.search')} passHref>
          <IconLink
            className={classNames('dm1:hidden', {
              hidden: !mobileNavOpened
            })}
            children={<SearchIcon className="h-6" />}
          />
        </Link>
        <div className="flex flex-auto items-center h-full text-blue-600">
          <div className="flex-auto" />
          {showSearchbar && <HeaderSearch />}
        </div>
        <MenuButton
          openedTitle={t(`menu.close`)}
          closedTitle={t(`menu`)}
          opened={mobileNavOpened}
          toggleOpened={() => setMobileNavOpened((p) => !p)}
          className="dm1:hidden"
        />
      </PublicHeader>
    </>
  );
}
