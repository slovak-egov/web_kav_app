import { InformationBanner, InformationBannerProps } from '@eslovensko/idsk-react';
import React from 'react';

import { getUrlFromProps, parseFromDrupal, parseLinks } from 'utils/utils';
import Link from 'next/link';

export default function ParagraphInfoBanner(props) {
  const hrefAttr = getUrlFromProps(props);

  const link =
    hrefAttr &&
    (props.field_link_type === 'external'
      ? !!props.field_external_link?.title
        ? props.field_external_link.title
        : hrefAttr
      : props.field_content_reference?.title);
  return (
    <InformationBanner
      hideCloseButton={true}
      variant={props.field_type as InformationBannerProps['variant']}
      title={props.field_title}
    >
      <div className="p-text p-text-shrink">
        {parseFromDrupal(props?.field_description?.processed, {
          parserOptions: parseLinks
        })}
      </div>
      {!!hrefAttr && (
        <Link href={hrefAttr}>
          <a
            className="idsk-link-s"
            target={
              props.field_link_type === 'external' || hrefAttr === '/rss' ? '_blank' : '_self'
            }
          >
            {link}
          </a>
        </Link>
      )}
    </InformationBanner>
  );
}
