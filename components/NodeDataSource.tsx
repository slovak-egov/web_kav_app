import { Signpost } from '@eslovensko/idsk-react';
import React from 'react';

interface NodeDataSourceProps {
  node: any;
}

export default function NodeDataSource({ node }: NodeDataSourceProps) {
  return (
    <Signpost
      className="p-text h-full"
      href={'#'}
      heading={node?.title ?? ''}
      children={node.field_description ?? ''}
      layout="horizontal"
      target={'_self'}
    />
  );
}
