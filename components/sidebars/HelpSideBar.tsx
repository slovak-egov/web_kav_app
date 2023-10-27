import { ModalSideBar } from '@eslovensko/idsk-react';

import OpenIcon from '@eslovensko/idsk-react/dist/assets/svgIcons/Actions/open_in_new.svg';
import ChatIcon from '@eslovensko/idsk-react/dist/assets/svgIcons/Communication/chat_bubble.svg';
import MailIcon from '@eslovensko/idsk-react/dist/assets/svgIcons/Content/mail.svg';
import PhoneIcon from '@eslovensko/idsk-react/dist/assets/svgIcons/Maps/local_phone.svg';

import { useTranslation } from 'next-i18next';

export default function HelpSideBar({ opened, toggleOpened }) {
  const { t } = useTranslation('common');

  return (
    <ModalSideBar
      id="help-sidebar-modal"
      opened={opened}
      toggleOpened={toggleOpened}
      heading={t('help.heading')}
      focusLockProps={{ disabled: !opened }}
    >
      <div className="flex-col py-5 border-b border-neutral-300 w-[90%] m-auto">
        <div className="flex cursor-pointer">
          <div className="w-1/2">
            <p className="py-2">{t('help.questions')}</p>
          </div>
          <OpenIcon className="w-5 text-blue-500" />
        </div>
        <div className="flex cursor-pointer">
          <div className="w-1/2">
            <p className="py-2">{t('help.feedback')}</p>
          </div>
          <OpenIcon className="w-5 text-blue-500" />
        </div>
      </div>
      <div className="flex-col py-5 w-[90%] m-auto">
        <div className="py-2 flex cursor-pointer">
          <ChatIcon className="w-5 text-blue-500 mr-2" />
          <p>{t('help.chat')}</p>
        </div>
        <div className="py-2 flex cursor-pointer">
          <MailIcon className="w-5 text-blue-500 mr-2 " />
          <p className="py-2">{t('help.mail')}</p>
        </div>
        <div className="py-2 flex items-start cursor-pointer">
          <PhoneIcon className="w-7 text-blue-500 mr-2 mt-3 " />
          <p className="py-2">{t('help.call')}</p>
        </div>
      </div>
    </ModalSideBar>
  );
}
