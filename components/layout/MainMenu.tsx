import { Navigation, NavigationLink, NavigationLinkOption } from '@eslovensko/idsk-react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useTranslation } from 'next-i18next';

export default function Header({ menu, ...props }) {
  const { asPath, locale, defaultLocale } = useRouter();
  const { t } = useTranslation('common');
  return (
    <Navigation {...props}>
      <Link href="/" locale={locale} passHref>
        <NavigationLink label={t(`menu.home`)} selected={asPath === '/'} />
      </Link>
      {menu.map((menuItem, index) =>
        !menuItem?.items ? (
          <Link href={menuItem.url} key={index} passHref>
            <NavigationLink
              title={menuItem.description}
              label={menuItem.title}
              selected={`${locale === defaultLocale ? '' : '/' + locale}${asPath}` === menuItem.url}
            />
          </Link>
        ) : (
          <NavigationLink
            label={menuItem.title}
            key={index}
            id={menuItem.id}
            title={menuItem.description}
          >
            {menuItem.items.map((option, optionIndex) => (
              <Link key={optionIndex} href={option.url} passHref>
                <NavigationLinkOption label={option.title} title={option.description} />
              </Link>
            ))}
          </NavigationLink>
        )
      )}
    </Navigation>
  );
}
