import { useEffect, useRef, useState } from 'react';
import { NodeArticleTeaser } from './node-types/NodeArticle';
import { ArticleCard, Loader, Pagination, Tag } from '@eslovensko/idsk-react';
import { useRouter } from 'next/router';
import Image from 'next/image';
import CheckIcon from '@eslovensko/idsk-react/dist/assets/svgIcons/Navigation/check.svg';

import emptyImg from 'public/images/empty_state.png';
import { useTranslation } from 'next-i18next';
import axios from 'axios';
import { handleClientErrorToLog } from 'utils/utils';
import classNames from 'classnames';
import { ScrollTo, scrollToAction } from 'components';

const Shimmer = () => {
  const pulseClasses = 'animate-pulse bg-neutral-300 rounded-full';
  return (
    <ArticleCard
      heading={<div className={classNames(pulseClasses, 'w-1/2 mb-4 mt-2 h-7')} />}
      featuredImg={
        <div className="animate-pulse bg-neutral-300 w-full aspect-[3/2] tb1:w-[320px] tb1:h-[214px]">
          <Loader className="h-full flex justify-center" />
        </div>
      }
      layout="vertical"
    >
      <div className="flex flex-col gap-2.5">
        <div className={classNames(pulseClasses, 'w-11/12 h-5')} />
        <div className={classNames(pulseClasses, 'w-full h-5')} />
        <div className={classNames(pulseClasses, 'w-5/6 h-5')} />
        <div className={classNames(pulseClasses, 'w-2/4 h-4 mt-2')} />
      </div>
    </ArticleCard>
  );
};

export default function NodeList({
  nodes,
  tags,
  withTags = true,
  withPagination = true,
  perPage = 5,
  pageCount = 0,
  nodeType,
  id = nodeType,
  parentWidth,
  ...props
}) {
  const [currentItems, setCurrentItems] = useState(nodes);
  const [page, setPage] = useState<number>(0);
  const [currentPageCount, setCurrentPageCount] = useState<number>(pageCount);

  const [tagsFilter, setTagsFilter] = useState<string[]>([]);

  const [fetching, setFetching] = useState<boolean>(true);
  const nodeListRef = useRef<HTMLDivElement>(null);

  const removeTagFromFilter = (tagId) => {
    setTagsFilter((filterTags) =>
      filterTags.filter((tag) => {
        return tag !== tagId;
      })
    );
  };

  const router = useRouter();

  const { t } = useTranslation('common');

  let isGrid = false;
  if (parentWidth !== 'full' && parentWidth !== '2/3') {
    isGrid = true;
  }

  useEffect(() => {
    let wasUnmounted = false;
    const fetchNodes = async () => {
      const params = {
        'views-argument[0]': nodeType,
        'items-per-page': perPage,
        page: page,
        include: 'field_image.field_media_image,field_tags'
      };
      if (!!tagsFilter.length) {
        params['views-argument[1]'] = tagsFilter.join(',');
      }
      try {
        const response = (
          await axios.post('/api/fetch-nodes', {
            params,
            defaultLocale: !router.defaultLocale ? 'sk' : router.defaultLocale,
            locale: !router.locale ? 'sk' : router.locale
          })
        ).data;
        if (!wasUnmounted) {
          setCurrentItems(response.data);
          setCurrentPageCount(Math.ceil(response.meta.count / perPage));
        }
      } catch (e) {
        handleClientErrorToLog(e);
      }
      setFetching(false);
    };
    fetchNodes();
    return () => {
      wasUnmounted = true;
    };
  }, [page, tagsFilter, nodeType, perPage, router]);

  useEffect(() => {
    const pageFromUrl = router.query?.[`page-${id}`];
    if (!!pageFromUrl && Number(pageFromUrl) !== 0) {
      setPage(Number(pageFromUrl) - 1);
    }
  }, [router.query, id]);

  return (
    <div {...props} className="print:hidden">
      <ScrollTo ref={nodeListRef} />
      {withTags && !!tags?.length && (
        <div className="mb-14 flex gap-2.5 flex-wrap">
          {tags.map((tag, index) => (
            <Tag
              role="checkbox"
              aria-checked={tagsFilter.includes(tag.drupal_internal__tid)}
              interaction={true}
              label={tag.name}
              key={index}
              leftIcon={
                tagsFilter.includes(tag.drupal_internal__tid) ? (
                  <CheckIcon className="h-5" />
                ) : (
                  <></>
                )
              }
              selected={tagsFilter.includes(tag.drupal_internal__tid)}
              onClick={() => {
                if (tagsFilter.includes(tag.drupal_internal__tid)) {
                  removeTagFromFilter(tag.drupal_internal__tid);
                } else {
                  setTagsFilter((prevTags) => [...prevTags, tag.drupal_internal__tid]);
                }
              }}
            />
          ))}
        </div>
      )}
      <div className="flex flex-col gap-5 mb-10">
        {!!currentItems?.length ? (
          currentItems.map((node, index) =>
            !fetching ? (
              <NodeArticleTeaser
                node={node.attributes}
                key={index}
                layout={isGrid ? 'horizontal' : 'vertical'}
              />
            ) : (
              <Shimmer key={index} />
            )
          )
        ) : (
          <div>
            <div className="relative w-44 max-w-full mb-10">
              <Image src={emptyImg} quality={85} />
            </div>
            <h3>{t('related_content.empty_list', { node_type: t('node_type.article') })}</h3>
          </div>
        )}
      </div>
      {!!withPagination && currentPageCount > 1 && (
        <Pagination
          className="mb-8"
          pageCount={currentPageCount}
          forcePage={page}
          onPageChange={(p) => {
            scrollToAction(nodeListRef);
            setFetching(true);
            setPage(p.selected);
            router.query[`page-${id}`] = `${p.selected + 1}`;
            router.push(router, undefined, { scroll: false });
          }}
          ariaLabelBuilder={(i) => {
            let ariaLabel = `${t('pagination.page')} ${i}`;
            if (i === page + 1) {
              ariaLabel += ` - ${t('pagination.actual_page')}`;
            }
            return ariaLabel;
          }}
          previousAriaLabel={t('pagination.previous_page')}
          nextAriaLabel={t('pagination.next_page')}
        />
      )}
    </div>
  );
}
