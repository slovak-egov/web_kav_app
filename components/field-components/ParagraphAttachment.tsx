import { useTranslation } from 'next-i18next';
import { formatDate } from 'utils/utils';
import { formatBytes } from '@eslovensko/idsk-react';
import DocumentIcon from '@eslovensko/idsk-react/dist/assets/svgIcons/File/text_snippet.svg';
import ParagraphVideo from './ParagraphVideo';
import Link from 'next/link';

export default function ParagraphAttachment(props) {
  const { t } = useTranslation('common');
  const data = props?.field_attachment_media;
  if (!data?.length) return null;
  const getAttachment = (document, labelledby) => {
    const documentType = document?.filename?.substr(document?.filename.lastIndexOf('.') + 1);
    const downloadName = t('attachm.download_in_format', {
      format: documentType,
      size: formatBytes(document?.filesize)
    });
    return (
      <>
        <a
          href={`/api/files?url=${encodeURIComponent(document?.uri.url)}`}
          key={document?.id}
          className="idsk-link-s font-bold w-full mb-2 inline-block"
          aria-label={`${labelledby} - ${downloadName}`}
          download
        >
          {downloadName}
        </a>
      </>
    );
  };

  const getLink = (media) => {
    let redirectUrl = media.field_media_entity_link.uri + '';
    const target = redirectUrl?.includes('internal:') ? '_self' : '_blank';
    redirectUrl = redirectUrl.replace('internal:', '');
    if (redirectUrl.includes('<nolink>')) {
      return (
        <a className="idsk-link-m" target={target}>
          {media.field_media_entity_link.title}
        </a>
      );
    }
    return (
      <>
        <Link href={redirectUrl}>
          <a className="idsk-link-m" target={target}>
            {media.field_media_entity_link.title}
          </a>
        </Link>
      </>
    );
  };

  const getAttachmentMedia = (media) => {
    switch (media.type) {
      case 'media--document':
        return (
          !!media?.field_media_documents?.length &&
          media.field_media_documents.map((document) => getAttachment(document, media.name))
        );
      case 'media--image':
        return getAttachment(media.field_media_image, media.name);
      case 'media--remote_video':
        return <ParagraphVideo field_video={media} />;
      case 'media--link':
        return getLink(media);
    }
  };

  return (
    <div className="pt-4 print:hidden">
      {data.map((media) => {
        const attachments = getAttachmentMedia(media);
        if (!media?.name) return undefined;
        return (
          <div className="mt-4 border-t border-t-neutral-600 pt-4" key={media.id}>
            <div className="flex mb-4">
              <div className="flex-none mr-2 rounded-md bg-neutral-200 p-3">
                <DocumentIcon className="h-6 text-black" />
              </div>
              <div className="flex-auto">
                <h4>{media.field_name || media.name}</h4>
                <p>{media.field_media_description}</p>
              </div>
              <div className="flex-none">{formatDate(media.created, props.langcode)}</div>
            </div>
            {attachments}
          </div>
        );
      })}
    </div>
  );
}
