import { Tooltip } from 'components';
import { FieldComponentsProps } from 'components/FieldComponents';
import { format, utcToZonedTime } from 'date-fns-tz';
import parse, {
  attributesToProps,
  domToReact,
  Element,
  HTMLReactParserOptions
} from 'html-react-parser';
import { sanitize } from 'isomorphic-dompurify';
import Link from 'next/link';
import { LocalStorage } from 'node-localstorage';

type ParseFromDrupalProps = {
  parserOptions?: HTMLReactParserOptions;
};

export function parseFromDrupal(html: string, { parserOptions }: ParseFromDrupalProps = {}) {
  return parse(sanitize(html ?? ''), parserOptions);
}

export const parseLinks: HTMLReactParserOptions = {
  replace: (domNode) => {
    const typedDomNode = domNode as Element;
    if (
      typedDomNode.type === 'tag' &&
      typedDomNode?.tagName === 'a' &&
      typedDomNode?.attribs?.href
    ) {
      if (typedDomNode.attribs.href?.[0] !== '/' || typedDomNode.attribs.href === '/rss') {
        typedDomNode.attribs.target = '_blank';
      } else {
        return (
          <Link href={typedDomNode.attribs.href}>
            <a {...attributesToProps(typedDomNode.attribs)}>
              {!!typedDomNode.children && domToReact(typedDomNode.children)}
            </a>
          </Link>
        );
      }
    }
  }
};

export const parseTooltip: HTMLReactParserOptions = {
  replace: (domNode) => {
    const typedDomNode = domNode as Element;
    if (typedDomNode.type === 'tag') {
      if (typedDomNode?.tagName === 'a' && typedDomNode?.attribs?.href) {
        if (typedDomNode.attribs.href?.[0] !== '/' || typedDomNode.attribs.href === '/rss') {
          typedDomNode.attribs.target = '_blank';
        } else {
          return (
            <Link href={typedDomNode.attribs.href}>
              <a {...attributesToProps(typedDomNode.attribs)}>
                {!!typedDomNode.children && domToReact(typedDomNode.children)}
              </a>
            </Link>
          );
        }
      } else if (typedDomNode?.tagName === 'abbr') {
        if (
          !!typedDomNode?.parent &&
          typedDomNode.parent.type === 'tag' &&
          typedDomNode.parent?.tagName === 'a'
        ) {
          return <>{!!typedDomNode.children && domToReact(typedDomNode.children)}</>;
        } else {
          return (
            <Tooltip
              title={parseFromDrupal(typedDomNode.attribs['data-tip'])}
              attribs={typedDomNode.attribs}
              classes={{
                tooltip:
                  'tooltip-from-drupal !bg-black !opacity-100 text-white !text-base !leading-[1.75rem] tracking-[.5px] !rounded-xl !p-8 z-50',
                arrow: '!text-black'
              }}
            >
              {!!typedDomNode.children && domToReact(typedDomNode.children)}
            </Tooltip>
          );
        }
      }
    }
  }
};

export function formatDate(input: string, locale: string): string {
  const date = new Date(input);
  return date.toLocaleDateString(locale);
}

export const gridLayoutFromParentW = (parentWidth: FieldComponentsProps['columnWidth']) =>
  parentWidth === '2/3'
    ? '50-50'
    : parentWidth === '1/3' || parentWidth === '1/2' || parentWidth === '1/4'
    ? 'full'
    : '33-34-33';

export const handleClientErrorToLog = (error, _customMessage = '') => {
  // TBD
};

export const formatInTimeZone = (date, dateFormat, tz) =>
  format(utcToZonedTime(date, tz), dateFormat, { timeZone: tz });

export function getCurrentTimestamp(): number {
  return Math.floor(Date.now() / 1000);
}

export function processNodeTitle({ node }) {
  let title = node?.title ?? node?.name;

  const titleMeta = node?.metatag?.find((meta) => {
    return meta?.tag === 'meta' && meta?.attributes?.name === 'title' && meta?.attributes?.content;
  });

  if (titleMeta) {
    title = titleMeta.attributes.content;
  }

  return title;
}

export function getRebuildStatus(localStorage: LocalStorage): object {
  return {
    state: localStorage.getItem('rebuildState') ?? 'idle',
    last_started_timestamp: localStorage.getItem('rebuildLastStartedTimestamp') ?? null,
    last_started_count: localStorage.getItem('rebuildLastCount') ?? null,
    last_started_progress: localStorage.getItem('rebuildLastProgress') ?? null,
    last_started_by: localStorage.getItem('rebuildLastStartedBy') ?? null,
    finished_timestamp: localStorage.getItem('rebuildFinishedTimestamp') ?? null,
    finished_by: localStorage.getItem('rebuildFinishedBy') ?? null
  };
}

export function getUrlFromProps(props) {
  return (
    !!props?.field_link_type &&
    (props.field_link_type === 'internal' && !!props?.field_content_reference
      ? props.field_content_reference?.path?.alias
        ? props.field_content_reference.path.alias
        : '/node/' + props.field_content_reference?.drupal_internal__nid
      : !!props?.field_external_link && props.field_external_link?.uri)
  );
}

export function NodeMetaTags({ node, serverBaseUrl }) {
  let canonical = false;
  let ogUrl = false;
  let ogImage = false;

  const finalResult = !!node?.metatag?.length
    ? node.metatag.reduce((result, meta) => {
        if (meta?.tag === 'meta') {
          if (meta?.attributes?.property === 'og:url') ogUrl = true;
          if (meta?.attributes?.property === 'og:image') ogImage = true;
          result.push(
            <meta
              key={meta?.attributes?.name ?? meta?.attributes?.property}
              name={meta?.attributes?.name}
              content={meta?.attributes?.content}
              property={meta?.attributes?.property}
              httpEquiv={meta?.attributes?.['http-equiv']}
            />
          );
        } else if (meta?.tag === 'link') {
          if (meta?.attributes?.rel === 'canonical') canonical = true;
          result.push(
            <link
              key={meta?.attributes?.type ?? meta?.attributes?.rel}
              rel={meta?.attributes?.rel}
              href={meta?.attributes?.href}
              type={meta?.attributes?.type}
              sizes={meta?.attributes?.sizes}
            />
          );
        }

        return result;
      }, [])
    : [];

  const slug = node?.path?.alias ? node.path.alias : `/node/${node?.drupal_internal__nid}`;
  const canonicalUrl = `${serverBaseUrl}${slug}`;

  if (!canonical) finalResult.push(<link key="canonical" rel="canonical" href={canonicalUrl} />);
  if (!ogUrl) finalResult.push(<meta key="og:url" property="og:url" content={canonicalUrl} />);
  if (!ogImage)
    finalResult.push(
      <meta
        property="og:image"
        key="og:image"
        content={`${serverBaseUrl}/images/share_image.jpg`}
      />
    );

  finalResult.push(<meta key="color-scheme" name="color-scheme" content="normal" />);
  finalResult.push(<link rel="apple-touch-icon" href="/images/touch_icon.png" />);

  return <>{finalResult}</>;
}

export const getBaseUrl = (
  apiCode: 'FEEDBACK' | 'DRUPAL' | 'EGOV-SERVICE' | 'EGOV-SERVICE-LOCATOR' | 'PACHO'
) => {
  let baseUrl = '';
  switch (apiCode) {
    case 'FEEDBACK':
      baseUrl = process.env.FEEDBACK_API_BASE_URL ?? '';
      break;
    case 'DRUPAL':
      baseUrl = process.env.DRUPAL_BASE_URL ?? '';
      break;
    case 'EGOV-SERVICE':
      baseUrl = process.env.EGOV_SERVICE_API_BASE_URL ?? '';
      break;
    case 'EGOV-SERVICE-LOCATOR':
      baseUrl = process.env.EGOV_SERVICE_LOCATOR_API_BASE_URL ?? '';
      break;
    case 'PACHO':
      baseUrl = process.env.PACHO_API_BASE_URL ?? '';
      break;
  }
  return !!baseUrl ? baseUrl : process.env.API_BASE_URL;
};

export const getDomainShortName = (): string => {
  const domainArray = location.hostname.split('.');
  return '.' + domainArray[domainArray.length - 2] + '.' + domainArray[domainArray.length - 1];
};
