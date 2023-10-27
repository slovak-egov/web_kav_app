import Image from 'next/image';
import Link from 'next/link';
import placeholder from 'public/images/placeholder.png';
import { getUrlFromProps } from 'utils/utils';

function ImageContent(props) {
  const imgUrl =
    props?.field_image?.field_media_image?.image_style_uri?.content ||
    props?.field_image?.field_media_image?.uri?.url;
  return (
    <Image
      src={imgUrl}
      layout="fill"
      alt={props?.field_image?.field_media_image?.resourceIdObjMeta?.alt}
      className="absolute object-cover inset-0"
      placeholder="blur"
      blurDataURL={placeholder.src}
      quality={85}
    />
  );
}

export default function ParagraphImage(props) {

  let redirectUrl = props.field_external_link?.uri + '';
  const target =
    redirectUrl?.includes('entity:') || redirectUrl?.includes('internal:') ? '_self' : '_blank';
  redirectUrl = redirectUrl.replace('entity:', '/');
  redirectUrl = redirectUrl.replace('internal:', '');

  return (
    <div className="print:hidden">
      <div className="relative aspect-[3/2]">
        {!redirectUrl.includes('<nolink>') && props.field_external_link?.uri ? (
          <Link href={redirectUrl}>
            <a className="idsk-link-m block w-full h-full" target={target}>
              <ImageContent {...props} />
            </a>
          </Link>
        ) : (
          <ImageContent {...props} />
        )}
      </div>
      {!!props?.field_title && (
        <p className="idsk-text-body-1 pt-1 text-neutral-600">{props.field_title}</p>
      )}
    </div>
  );
}
