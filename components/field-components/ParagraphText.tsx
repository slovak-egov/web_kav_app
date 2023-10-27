import { parseFromDrupal, parseTooltip } from 'utils/utils';

export default function ParagraphText(props) {
  return (
    <div
      className={`li-margin p-text idsk-text-body ${
        props?.field_fullwidth === 'true' ? '' : 'max-w-3xl'
      }`}
    >
      {parseFromDrupal(props?.field_content?.value, { parserOptions: parseTooltip })}
    </div>
  );
}
