import * as React from 'react';
import dynamic from 'next/dynamic';
// import { NodeArticleTeaser } from 'components/node-types/NodeArticle';
import { useTranslation } from 'next-i18next';
import { GridLayout } from 'components';
import { gridLayoutFromParentW } from 'utils/utils';
import { NodeFAQ } from 'components/node-types/NodeFAQ';

export default function ParagraphRelatedContent(props) {
  const { t } = useTranslation('common');

  const { relatedContent, parentWidth } = props;
  let isGrid: boolean = props?.field_related_display_mode === 'grid';

  if (parentWidth !== 'full' && parentWidth !== '2/3') {
    isGrid = true;
  }

  const DynamicNodeDataSourceTeaser = dynamic(
    () => import('components/node-types/NodeArticle').then((mod) => mod.NodeDataSourceTeaser),
    { ssr: false } // Disable SSR for the NodeArticleTeaser component
  );
  const DynamicNodeArticleTeaser = dynamic(
    () => import('components/node-types/NodeArticle').then((mod) => mod.NodeArticleTeaser),
    { ssr: false } // Disable SSR for the NodeArticleTeaser component
  );
  if (!!relatedContent.length) {
    return (
      <div className="print:hidden">
        <h2 className="py-8">{props?.field_title || t('related_content.title')}</h2>
        <GridLayout layout={isGrid ? gridLayoutFromParentW(parentWidth) : 'full'}>
          {relatedContent.map((resource) => {
            switch (resource.type) {
              case 'node--news':
              case 'node--article':
              case 'node--notice':
                return (
                  <DynamicNodeArticleTeaser
                    key={resource?.id}
                    node={resource}
                    layout={isGrid ? 'horizontal' : 'vertical'}
                  />
                );
              case 'node--faq':
                return <NodeFAQ key={resource?.id} node={resource} />;
              case 'node--data_source':
                return (
                  <DynamicNodeDataSourceTeaser
                    key={resource?.id}
                    node={resource}
                    layout={isGrid ? 'horizontal' : 'vertical'}
                  />
                );
            }
          })}
        </GridLayout>
      </div>
    );
  }

  return null;
}
