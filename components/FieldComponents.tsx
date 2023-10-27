import classNames from 'classnames';
import dynamic from 'next/dynamic';
import ParagraphReportSearch from './field-components/ParagraphReportSearch';
import FieldNavigation from './FieldNavigation';

const ParagraphImage = dynamic(() => import('./field-components/ParagraphImage'));
const ParagraphRelatedContent = dynamic(() => import('./field-components/ParagraphRelatedContent'));
const ParagraphView = dynamic(() => import('./field-components/ParagraphView'));
const ParagraphText = dynamic(() => import('./field-components/ParagraphText'));
const ParagraphLink = dynamic(() => import('./field-components/ParagraphLink'));
const ParagraphInfoBanner = dynamic(() => import('./field-components/ParagraphInfoBanner'));
const ParagraphHeading = dynamic(() => import('./field-components/ParagraphHeading'));
const ParagraphAttachment = dynamic(() => import('./field-components/ParagraphAttachment'));
const ParagraphSignpost = dynamic(() => import('./field-components/ParagraphSignpost'));
const ParagraphForm = dynamic(() => import('./field-components/ParagraphForm'));
const ParagraphOrganizationSearch = dynamic(
  () => import('./field-components/ParagraphOrganizationSearch')
);
const ParagraphRelatedFAQ = dynamic(() => import('./field-components/ParagraphRelatedFAQ'));
const ParagraphVideo = dynamic(() => import('./field-components/ParagraphVideo'));
const ParagraphAccordion = dynamic(() => import('./field-components/ParagraphAccordion'));
const ParagraphTable = dynamic(() => import('./field-components/ParagraphTable'));

export interface FieldComponentsProps {
  components: { [key: string]: any }[];
  className?: string;
  columnWidth?: 'full' | '1/3' | '2/3' | '1/2' | '1/4';
  field_components?: any;
}

export default function FieldComponents({
  components,
  className,
  columnWidth = 'full',
  field_components
}: FieldComponentsProps) {
  return (
    <div className={classNames('flex flex-col', className)}>
      {components?.map((component, i) => {
        switch (component.type) {
          case 'paragraph--view':
            return <ParagraphView {...component} key={component?.id} parentWidth={columnWidth} />;
          case 'paragraph--text':
            return <ParagraphText {...component} key={component?.id} />;
          case 'paragraph--link':
            return <ParagraphLink {...component} key={component?.id} />;
          case 'paragraph--attachments':
            return <ParagraphAttachment {...component} key={component?.id} />;
          case 'paragraph--heading':
            return <ParagraphHeading {...component} key={component?.id} />;
          case 'paragraph--image':
            return <ParagraphImage {...component} key={component?.id} />;
          case 'paragraph--related_content':
            return (
              <ParagraphRelatedContent
                {...component}
                key={component?.id}
                parentWidth={columnWidth}
              />
            );
          case 'paragraph--frontend_form':
            return <ParagraphForm {...component} key={component?.id} />;
          case 'paragraph--organization_search':
            return <ParagraphOrganizationSearch {...component} key={component?.id} />;
          case 'paragraph--search_report':
            return <ParagraphReportSearch {...component} key={component?.id} />;
          case 'paragraph--signpost':
            return <ParagraphSignpost {...component} key={component?.id} />;
          case 'paragraph--info_banner':
            return <ParagraphInfoBanner {...component} key={component?.id} />;
          case 'paragraph--faq':
            return <ParagraphRelatedFAQ {...component} key={component?.id} />;
          case 'paragraph--video':
            return <ParagraphVideo {...component} key={component?.id} />;
          case 'paragraph--accordion':
            return (
              <ParagraphAccordion
                {...component}
                key={component?.id}
                index={i}
                lastStep={components.length === i + 1}
              />
            );
          case 'paragraph--table':
            return <ParagraphTable {...component} key={component?.id} />;
          case 'paragraph--content':
            return <FieldNavigation components={field_components} key={component?.id} />;
          default:
            return (
              <div className="grid grid-cols-1">
                <h2 className="mb-4">TITLEEEEEEEEEEEEEEEEEEEEE</h2>
              </div>
            );
        }
      })}
    </div>
  );
}
