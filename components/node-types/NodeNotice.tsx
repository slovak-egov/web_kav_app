import { NodeTeaser } from 'components';

interface NodeNoticeTeaserProps {
  node: any;
  layout?: 'vertical' | 'horizontal';
}

export function NodeNoticeTeaser(props: NodeNoticeTeaserProps) {
  return <NodeTeaser {...props} imagePlaceholder={false} />;
}
