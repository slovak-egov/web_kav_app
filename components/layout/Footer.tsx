import {
  FooterContainer,
  FooterContainerSectionHeading,
  FooterContainerSection
} from '@eslovensko/idsk-react';
import Link from 'next/link';
import Image from 'next/image';
import classNames from 'classnames';
import { parseFromDrupal } from 'utils/utils';
import { useTranslation } from 'next-i18next';
import { Tooltip } from '@mui/material';

export default function Footer({ data, logoSrc, logoAlt, menu, version }) {
  const { t } = useTranslation('common');
  const mainMenu = menu.main;
  const asideMenu = menu.aside;

  return (
    <FooterContainer
      linksList={[
        ...asideMenu.map((item, index) => (
          <Link href={item.url} key={index} passHref>
            <Tooltip title={item.description}>
              <a target={!!item?.options?.external || item.url === '/rss' ? '_blank' : '_self'}>
                {item.title}
              </a>
            </Tooltip>
          </Link>
        ))
      ]}
      bottomSection={
        <div className="flex justify-between flex-wrap gap-8">
          <div>
            {parseFromDrupal(data.text)}
            {!!version && (
              <div>
                {t('version')} {version}
              </div>
            )}
          </div>
          {!!logoSrc && (
            <div className="relative w-40 flex items-center">
              <Image src={logoSrc} width="162" height="36" alt={logoAlt} quality={100} />
            </div>
          )}
        </div>
      }
    >
      <div className="grid grid-cols-1 tb1:grid-cols-2 tb2:grid-cols-4 gap-5">
        {mainMenu.slice(0, 4).map((section, index) => (
          <FooterContainerSection
            key={index}
            className={classNames({ 'tb2:items-end': index === 3 })}
          >
            <FooterContainerSectionHeading
              className={classNames({ 'hidden tb1:block': section.title === '&nbsp;' })}
            >
              {parseFromDrupal(section.title)}
            </FooterContainerSectionHeading>
            {!!section?.items?.length && (
              <ul className={classNames('list-none grid gap-4', { 'tb2:text-end': index === 3 })}>
                {section.items.map((option, optionIndex) => (
                  <li key={optionIndex}>
                    <Link href={option.url} passHref>
                      <Tooltip title={option.description}>
                        <a
                          target={
                            !!option?.options?.external || option.url === '/rss'
                              ? '_blank'
                              : '_self'
                          }
                          rel={!!option?.options?.external ? 'noreferrer noopener' : ''}
                        >
                          {option.title}
                        </a>
                      </Tooltip>
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </FooterContainerSection>
        ))}
      </div>
    </FooterContainer>
  );
}
