import { NodeList } from 'components';

export default function ParagraphView(props) {
  return (
    <NodeList
      nodes={props.data}
      tags={props.tags}
      perPage={props.field_items_per_page}
      pageCount={Math.ceil(props.dataTotalCount / props.field_items_per_page)}
      nodeType={props.field_content_type.resourceIdObjMeta.drupal_internal__target_id}
      id={props.id}
      key={props.id}
      parentWidth={props.parentWidth}
    />
  );
}
