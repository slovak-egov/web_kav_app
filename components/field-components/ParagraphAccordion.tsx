import { Accordion } from '@eslovensko/idsk-react';
import FieldComponents from '../FieldComponents';
import { useTranslation } from 'next-i18next';

function countServices(component) {
  let count = 0;

  if (component.field_components) {
    for (const nestedComponent of component.field_components) {
      if (nestedComponent.type == 'paragraph--signpost') {
        count++;
      }
      count += countServices(nestedComponent);
    }
  }
  return count;
}

export default function ParagraphAccordion(props) {
  // eslint-disable-next-line @typescript-eslint/naming-convention
  const { index, field_annotation, field_components, id, field_step, lastStep } = props;

  const stepNumber = (
    <div className="w-max h-full relative">
      <div className="flex items-center justify-center w-[38px] h-[36px]  rounded-full border border-black bg-white">
        <p className="idsk-link-m text-black no-underline font-bold">{index}</p>
      </div>
      {!lastStep && <div className=" w-[1px] m-auto h-full bg-black"></div>}
    </div>
  );

  return (
    <div className="flex gap-4 items-baseline ">
      {field_step && stepNumber}
      <Accordion
        heading={
          <div className="flex items-center">
            <h3 className="idsk-link-l text-black">{props.field_title}</h3>
          </div>
        }
        subTitle={field_annotation}
        fullWidthBody={true}
        bgGray={true}
        className="w-full"
        size="small"
      >
        {!!field_components && (
          <FieldComponents
            className="gap-8"
            components={field_components}
            key={`accordion-${id}`}
          />
        )}
      </Accordion>
    </div>
  );
}
