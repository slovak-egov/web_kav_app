import { PrimaryButton } from '@eslovensko/idsk-react';
import classNames from 'classnames';
import Link from 'next/link';
import { useRouter } from 'next/router';

export default function ParagraphLink(props) {
  const router = useRouter();
  // const internal = props.field_link_type === 'internal';
  // const href = internal
  //   ? props.field_content_reference?.path?.alias
  //     ? props.field_content_reference.path.alias
  //     : '/node/' + props.field_content_reference?.drupal_internal__nid
  //   : props.field_external_link.uri;

  let redirectUrl = props.field_external_link?.uri + '';
  const target =
    redirectUrl?.includes('entity:') || redirectUrl?.includes('internal:') ? '_self' : '_blank';
  redirectUrl = redirectUrl.replace('entity:', '/');
  redirectUrl = redirectUrl.replace('internal:', '');

  const className = classNames({
    'idsk-link-l': props.field_font_size === 'l',
    'idsk-link-m': props.field_font_size === 'm',
    'idsk-link-s': props.field_font_size === 's'
  });

  return (
    <div className="items-start">
      {props?.field_link_style && props.field_link_style === 'button' ? (
        <PrimaryButton
          type="button"
          size={props?.field_button_size === 'l' ? 'large' : 'medium'}
          onClick={() => {
            if (target !== '_blank') {
              router.push(redirectUrl);
            } else {
              window.open(redirectUrl, '_blank');
            }
          }}
        >
          {props.field_title}
        </PrimaryButton>
      ) : (
        <>
          {redirectUrl.includes('<nolink>') ? (
            <a className={className} target={target}>
              {props.field_title}
            </a>
          ) : (
            <Link href={redirectUrl}>
              <a className={className} target={target}>
                {props.field_title}
              </a>
            </Link>
          )}
        </>
      )}
    </div>
  );
}
