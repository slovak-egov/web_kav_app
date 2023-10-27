import { useTranslation } from 'next-i18next';
import { useRouter } from 'next/router';

import { AvatarCircle, TextButton, Tooltip } from '@eslovensko/idsk-react';
import ContentCopyIcon from '@eslovensko/idsk-react/dist/assets/svgIcons/Content/content_copy.svg';

import { UserProps } from '@skit-saml-auth/react';
import { getCookie } from 'cookies-next';
import BaseButton from '@eslovensko/idsk-react/dist/components/Atoms/Button/BaseButton';
import classNames from 'classnames';

interface UserCardProps {
  user: UserProps;
  className?: string;
}

const UserCard = ({ user, className }: UserCardProps) => {
  const { t } = useTranslation('common');
  const router = useRouter();

  const fullName = getCookie('fullName')?.toString() ?? '';
  const isCompany = Boolean(getCookie('isCompany'));

  return (
    <div className={classNames('flex flex-row px-5 items-start gap-x-5 mt-7', className)}>
      <AvatarCircle
        buttonClasses="w-12 h-12 text-lg"
        fullName={fullName || user.attributes['Subject.FormattedName']}
        isCompany={isCompany}
      />
      <div className="flex flex-col items-start justify-start">
        <h4 className="text-xl">{fullName || user.attributes['Subject.FormattedName']}</h4>
        {!!fullName && (
          <p className="flex flex-row justify-start items-center">{`${t(
            'modal.inRepresentation'
          )} ${user?.attributes?.['Subject.FormattedName']}`}</p>
        )}
        {
          <div className="flex gap-1 items-center w-fit text-neutral-700 mt-2">
            <p>{`${t('edeskNumber')}: ${user?.attributes['Subject.eDeskNumber'] || ''}`}</p>
            <Tooltip tooltip={t('copy')} alignLeft>
              <BaseButton
                id="btn-copy"
                className="hover:bg-blue-100 p-1 rounded-sm active:bg-blue-200"
                onClick={() => {
                  navigator.clipboard.writeText(user?.attributes['Subject.eDeskNumber'] || '');
                }}
              >
                <ContentCopyIcon className="w-4 text-primary" />
              </BaseButton>
            </Tooltip>
          </div>
        }
        <TextButton
          id="profile-sidebar-change"
          label={t('modal.changeRepresentation')}
          className="-ml-3.5 mt-2"
          onClick={() => {
            router.push(`${process.env.NEXT_PUBLIC_MOJE_SLOVENSKO_APP_BASE_URL}/vyber-subjektu`);
          }}
        />
      </div>
    </div>
  );
};

export default UserCard;
