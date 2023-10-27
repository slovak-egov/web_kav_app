import { NodeShareLinks, NodeDates } from 'components';

export default function NodeDatesAndShareLinks({ node }) {
  return (
    <div className="grid grid-cols-1 tb1:grid-cols-3 mb-8 tb1:mb-5 mt-5">
      <NodeDates node={node} className="col-start-1 row-span-1 col-span-2" />
      <NodeShareLinks node={node} />
    </div>
  );
}
