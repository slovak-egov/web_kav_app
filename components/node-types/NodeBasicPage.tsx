import { ComponentsLayout } from 'components';
import NodeDates from 'components/NodeDates';

export default function NodeBasicPage({ node, data }) {
  return (
    <>
      {!!node?.field_components?.length &&
        node.field_components.map((section) => (
          <ComponentsLayout
            data={section}
            key={section.id}
            field_components={node?.field_components}
          />
        ))}
      {data.cookiesSettingsNode !== node.id && (
        <div className="mb-8 tb1:mb-20 mt-5">
          <NodeDates node={node} />
        </div>
      )}
    </>
  );
}
