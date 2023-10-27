import { Tag } from '@eslovensko/idsk-react';
import { useTranslation } from 'next-i18next';
import {
  NodeTeaser,
  NodeComments,
  NodeDatesAndShareLinks,
  CommentForm,
  FieldComponents,
  GridLayout,
  Feedback
} from 'components';
import FieldNavigation from 'components/FieldNavigation';
import NodeDataSource from 'components/NodeDataSource';

export default function NodeArticle({ node }) {
  const { t } = useTranslation('common');
  const dateFormat =
    t('date.format_string') === 'date.format_string' ? 'yyyy-MM-dd' : t('date.format_string');
  const timeFormat =
    t('time.format_string') === 'time.format_string' ? 'HH:mm' : t('time.format_string');

  return (
    <GridLayout layout={node?.field_content === 'left' ? '33-67' : '67-33'} className="pb-20">
      {node?.field_content === 'left' && <FieldNavigation components={node.field_components} />}
      <div className="node-article">
        {!!node?.field_tags?.length && (
          <div className="mb-8 flex gap-2.5 flex-wrap">
            {node.field_tags.map((tag, index) => (
              <Tag label={tag.name} key={index} variant={tag.field_farba} />
            ))}
          </div>
        )}
        {!!node?.field_components?.length && (
          <FieldComponents components={node.field_components} columnWidth="2/3" className="gap-8" />
        )}
        <NodeDatesAndShareLinks node={node} />
        <Feedback
          configurationItemId={process.env.NEXT_PUBLIC_MODUL_CIID}
          originCiId={'0554709d79ba4cb29c0b7d6e454c7344'}
          identityId={'89700cc70ef244878d91822825687266'}
          relatedCiId={'E2261CCD4A872B4AA925BEB0CD77C5FA'}
          feedbackApiBaseUrl="/api/gw/feedback"
          className="mt-8 print:hidden"
        />
        {!!node?.comment?.status && (
          <>
            {node.comment.status === 2 && (
              <CommentForm
                nodeData={{ type: node.type.substr(node.type.indexOf('-') + 2), id: node.id }}
              />
            )}
            {(node.comment.status === 2 ||
              (node.comment.status === 1 && node.comment.comment_count > 0)) && (
              <NodeComments node={node} dateFormat={dateFormat} timeFormat={timeFormat} />
            )}
          </>
        )}
      </div>
      {node?.field_content === 'right' && <FieldNavigation components={node.field_components} />}
    </GridLayout>
  );
}

interface NodeArticleTeaserProps {
  node: any;
  layout?: 'vertical' | 'horizontal';
}

export function NodeArticleTeaser(props: NodeArticleTeaserProps) {
  return <NodeTeaser {...props} imagePlaceholder={true} />;
}

export function NodeDataSourceTeaser(props: NodeArticleTeaserProps) {
  return <NodeDataSource {...props} />;
}
