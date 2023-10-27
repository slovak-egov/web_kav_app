import { useEffect, useState } from 'react';
import Twitter from 'public/icons/Twitter.svg';
import Facebook from 'public/icons/Facebook.svg';
import LinkedIn from 'public/icons/LinkedIn.svg';
import CopyUrl from 'public/icons/CopyUrl.svg';
import CheckIcon from '@eslovensko/idsk-react/dist/assets/svgIcons/Actions/check_circle.svg';
import { useTranslation } from 'next-i18next';
import { InformationBanner } from '@eslovensko/idsk-react';
import { CopyToClipboard } from 'react-copy-to-clipboard';

const NodeShareLinks = ({ node }) => {
  const [copied, setCopied] = useState(false);
  const [url, setUrl] = useState('');
  const { t } = useTranslation('common');

  useEffect(() => {
    setUrl(window.location.href);
  }, []);

  const title = encodeURIComponent(node.title);
  const relUrl = encodeURIComponent(url);
  const classes = 'h-6 fill-neutral-600 hover:fill-black';

  const links = [
    {
      title: t('share.twitter'),
      url: 'https://twitter.com/intent/tweet?url=' + relUrl + '&status=' + title,
      icon: <Twitter className={classes} />
    },
    {
      title: t('share.facebook'),
      url: 'https://www.facebook.com/share.php?u=' + relUrl + '&title=' + title,
      icon: <Facebook className={classes} />
    },
    {
      title: t('share.linkedin'),
      url:
        'https://www.linkedin.com/shareArticle?mini=true&url=' +
        relUrl +
        '&title=' +
        title +
        '&source=' +
        relUrl,
      icon: <LinkedIn className={classes} />
    }
  ];

  return (
    <>
      <div className="mt-5 tb1:mt-0 col-span-3 tb1:col-span-1 print:hidden">
        <div className="flex gap-4 tb1:float-right">
          {links.map((link, index) => (
            <a title={link.title} href={link.url} target="_blank" key={index}>
              {link.icon}
            </a>
          ))}
          <CopyToClipboard text={url} onCopy={() => setCopied(true)}>
            <a title={t('copy_url.title')} href="javascript:;">
              <CopyUrl className={classes} />
            </a>
          </CopyToClipboard>
        </div>
      </div>
      {!!copied && (
        <div className="col-start-1 row-span-1 col-span-3 mt-5">
          <InformationBanner
            icon={<CheckIcon className="w-6 h-6" />}
            title={t('copy_url.success')}
            variant="success"
            closeButtonOnClick={() => setCopied(false)}
          />
        </div>
      )}
    </>
  );
};

export default NodeShareLinks;
