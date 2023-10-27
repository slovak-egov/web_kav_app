import { ArticleCard } from '@eslovensko/idsk-react';
import Image from 'next/image';
import { parseFromDrupal } from 'utils/utils';
import placeholder from 'public/images/placeholder.png';
import Link from 'next/link';
import { useTranslation } from 'next-i18next';

interface NodeTeaserProps {
  node: any;
  layout?: 'vertical' | 'horizontal';
  imagePlaceholder?: boolean;
}

export default function NodeTeaser({
  node,
  layout = 'vertical',
  imagePlaceholder = true
}: NodeTeaserProps) {
  const { t } = useTranslation('common');

  // Extract tags from node
  const tags: string[] = [];
  node?.field_tags?.map((tag) => tags.indexOf(tag.name) < 0 && tags.push(tag.name));

  // Construct image URL
  const imgUrl = node?.field_image?.thumbnail?.image_style_uri
    ? `${node.field_image.thumbnail.image_style_uri?.teaser}`
    : null;

  // Construct link href
  const linkHref = node?.path?.alias ? node.path.alias : '/node/' + node?.drupal_internal__nid;

  // Render article image conditionally
  const articleImage = (
    <Link href={linkHref}>
      <a>
        {imagePlaceholder || !!imgUrl ? (
          <Image
            src={imgUrl ?? placeholder}
            width={320}
            height={214}
            layout="responsive"
            objectFit="cover"
            alt={node?.field_image?.field_media_image?.resourceIdObjMeta?.alt ?? ''}
            placeholder="blur"
            blurDataURL={placeholder.src}
            quality={100}
          />
        ) : (
          <>{''}</>
        )}
      </a>
    </Link>
  );

  // Define date format
  const dateFormat =
    t('date.format_string') === 'date.format_string' ? 'yyyy-MM-dd' : t('date.format_string');

  return (
    <ArticleCard
      featuredImg={articleImage} // Always provide the Image component here
      heading={
        node?.title && (
          <h3>
            <Link href={linkHref}>{node?.title}</Link>
          </h3>
        )
      }
      date={node?.created}
      dateFormatString={dateFormat}
      datePosition="bottom"
      layout={layout}
      tags={tags}
    >
      {parseFromDrupal(node?.field_perex?.processed)}
    </ArticleCard>
  );
}
