import { ReactElement } from 'react';
import { useTranslation } from 'next-i18next';
import classNames from 'classnames';

import PersonIcon from '@eslovensko/idsk-react/dist/assets/svgIcons/Social/person.svg';
import SettingsIcon from '@eslovensko/idsk-react/dist/assets/svgIcons/Actions/settings.svg';
import PeopleIcon from '@eslovensko/idsk-react/dist/assets/svgIcons/Social/people.svg';
import PhoneIcon from '@eslovensko/idsk-react/dist/assets/svgIcons/Hardware/phone_iphone.svg';

interface SideBarLinkGroupProps extends React.AllHTMLAttributes<HTMLDivElement> {
  border?: boolean;
}

export const SideBarLinkGroup = ({ children, border, className }: SideBarLinkGroupProps) => {
  const groupClasses = classNames(
    'my-5',
    {
      'border-b border-t border-neutral-300': border
    },
    className
  );

  return <div className={groupClasses}>{children}</div>;
};

interface SideBarLinkProps extends React.AllHTMLAttributes<HTMLLinkElement> {
  text: string;
  href: string;
  icon?: ReactElement<SVGAElement>;
  onClick: () => void;
}

export const SideBarLink = ({ text, href, icon, onClick }: SideBarLinkProps) => (
  <a
    className="flex flex-row gap-x-3 items-center cursor-pointer hover:bg-blue-100 px-5 py-5 active:bg-blue-200"
    onClick={onClick}
    href={`${process.env.NEXT_PUBLIC_MOJE_SLOVENSKO_APP_BASE_URL}${href}`}
  >
    {icon}
    <span className="idsk-text-body-1">{text}</span>
  </a>
);

interface SideBarNavigationProps {
  onClick: () => void;
}

const SideBarNavigation: React.FC<SideBarNavigationProps> = ({ onClick }) => {
  const { t } = useTranslation();

  const iconClasses = 'h-6 w-6 text-primary-medium';
  return (
    <SideBarLinkGroup id="sidebar-navigation-modal" border={true}>
      <SideBarLink
        id="sidebar-navigation-link1"
        text={t('modal.myProfile')}
        href="/profil"
        icon={<PersonIcon className={iconClasses} />}
        onClick={onClick}
      />
      <SideBarLink
        id="sidebar-navigation-link2"
        text={t('modal.settings')}
        href="/nastavenia"
        icon={<SettingsIcon className={iconClasses} />}
        onClick={onClick}
      />
      <SideBarLink
        id="sidebar-navigation-link3"
        text={t('modal.permissions')}
        href="/opravnenia"
        icon={<PeopleIcon className={iconClasses} />}
        onClick={onClick}
      />
      <SideBarLink
        id="sidebar-navigation-link4"
        text={t('modal.myDevices')}
        href="/moje-zariadenia"
        icon={<PhoneIcon className={iconClasses} />}
        onClick={onClick}
      />
    </SideBarLinkGroup>
  );
};

export default SideBarNavigation;
