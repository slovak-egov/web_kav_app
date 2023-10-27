import React from 'react';
import { Accordion } from '@eslovensko/idsk-react';

import { parseFromDrupal, parseTooltip } from 'utils/utils';

export const NodeFAQ = ({ node }) => {
  return (
    <Accordion
      heading={<p className="idsk-link-l font-bold text-black text-left">{node?.title}</p>}
      key={node?.id}
      bgGray={true}
      fullWidthBody={true}
      subTitle={node?.field_perex?.value ?? ''}
    >
      <div className="p-text">
        {parseFromDrupal(node?.field_faq_answer?.value, { parserOptions: parseTooltip })}
      </div>
    </Accordion>
  );
};
