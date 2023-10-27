import { NodeTeaser } from 'components';

interface NodeNewsTeaserProps {
  node: any;
  layout?: 'vertical' | 'horizontal';
}

export function NodeNewsTeaser(props: NodeNewsTeaserProps) {
  return <NodeTeaser {...props} imagePlaceholder={true} />;
}
