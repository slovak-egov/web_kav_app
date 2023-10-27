import { useTranslation } from 'next-i18next';

import { ModalSideBar, PrimaryButton } from '@eslovensko/idsk-react';

import { UserProps } from '@skit-saml-auth/react';
import { SideBarNavigation, SideBarLinkGroup, UserCard } from 'components/sidebars';

interface ProfileSideBarProps {
  opened: boolean;
  toggleOpened: React.Dispatch<React.SetStateAction<boolean>>;
  user: UserProps | undefined;
  handleLogout: () => void;
  handleEnterPrivateZone: () => void;
}

const ProfileSideBar = ({
  opened,
  toggleOpened,
  user,
  handleLogout,
  handleEnterPrivateZone
}: ProfileSideBarProps) => {
  const { t } = useTranslation('common');

  return (
    <ModalSideBar
      opened={opened}
      heading={t('modal.profile.title')}
      toggleOpened={toggleOpened}
      id="profile-side-bar"
      focusLockProps={{ disabled: !opened }}
    >
      {!!user && <UserCard user={user} />}
      <SideBarNavigation
        onClick={() => {
          toggleOpened(false);
        }}
      />
      <SideBarLinkGroup className="px-5 flex flex-col gap-4 py-0">
        <PrimaryButton
          size="medium"
          label={t(`enter_private_zone`)}
          fullWidth
          onClick={handleEnterPrivateZone}
        />
        <PrimaryButton
          variant="warning"
          size="medium"
          label={t(`button.logout`)}
          fullWidth
          onClick={handleLogout}
        />
      </SideBarLinkGroup>
    </ModalSideBar>
  );
};

export default ProfileSideBar;
