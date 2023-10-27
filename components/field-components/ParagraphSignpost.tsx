import { Signpost } from '@eslovensko/idsk-react';
import { HTMLReactParserOptions, Element, attributesToProps, domToReact } from 'html-react-parser';
import React from 'react';
import placeholder from 'public/images/placeholder.png';
import Image from 'next/image';

import { parseFromDrupal, parseLinks } from 'utils/utils';

export default function ParagraphSignpost(props) {
  let redirectUrl = props.field_external_link?.uri + '';
  const target =
    redirectUrl?.includes('entity:') || redirectUrl?.includes('internal:') ? '_self' : '_blank';
  redirectUrl = redirectUrl.replace('entity:', '/');
  redirectUrl = redirectUrl.replace('internal:', '');

  return (
    <Signpost
      icon={
        <>
          {props?.field_signpost_append === 'icon' && <FieldIcon fieldIcon={props?.field_icon} />}
          {props?.field_signpost_append === 'image' && (
            <FieldImage fieldImage={props?.field_image} />
          )}
        </>
      }
      className="p-text h-full"
      href={
        redirectUrl.includes('<nolink>') || !props.field_external_link?.uri
          ? undefined
          : redirectUrl
      }
      heading={props.field_heading}
      children={parseFromDrupal(props?.field_description?.processed, {
        parserOptions: parseLinks
      })}
      layout="horizontal"
      target={target}
    />
  );
}

export const FieldIcon = ({ fieldIcon }) => {
  const parserOptions: HTMLReactParserOptions = {
    replace: (domNode) => {
      const typedDomNode = domNode as Element;
      if (typedDomNode.attribs && typedDomNode.name === 'svg' && typedDomNode.children) {
        typedDomNode.attribs.height = '1.75rem';
        typedDomNode.attribs.width = '1.75rem';
        return (
          <svg {...attributesToProps(typedDomNode.attribs)}>
            {typedDomNode.children && domToReact(typedDomNode.children)}
          </svg>
        );
      }
    }
  };
  return (
    <>
      {!!fieldIcon?.computed_file_content ? (
        parseFromDrupal(fieldIcon.computed_file_content.replaceAll('black', 'currentColor'), {
          parserOptions
        })
      ) : (
        <div className="w-7 h-7" />
      )}
    </>
  );
};

const FieldImage = ({ fieldImage }) => {
  const imgUrl = fieldImage?.thumbnail?.image_style_uri
    ? `${fieldImage.thumbnail.image_style_uri?.teaser}`
    : placeholder;

  return (
    <Image
      width={fieldImage?.thumbnail?.resourceIdObjMeta?.width}
      height={fieldImage?.thumbnail?.resourceIdObjMeta?.height}
      src={imgUrl}
      alt={fieldImage?.thumbnail?.resourceIdObjMeta?.alt ?? ''}
      placeholder="blur"
      blurDataURL={placeholder.src}
      quality={85}
    />
  );
};
