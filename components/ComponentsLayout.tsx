import FieldComponents, { FieldComponentsProps } from './FieldComponents';
import classNames from 'classnames';
import { useEffect, useMemo, useState } from 'react';
import { UAParser } from 'ua-parser-js';
import { isLinuxOS } from '../utils/linux';

export interface GridLayoutProps extends React.HTMLAttributes<HTMLDivElement> {
  layout?:
    | 'full'
    | '67-33'
    | '33-67'
    | '50-50'
    | '33-34-33'
    | '25-25-25-25'
    | 'text'
    | '25-75'
    | '75-25';
}

export const GridLayout = ({ layout = 'full', className, children }: GridLayoutProps) => {
  const classes = classNames(
    'grid gap-5',
    {
      'grid-cols-1 tb2:grid-cols-[minmax(0,3fr)_minmax(0,1fr)]': layout === '75-25',
      'grid-cols-1 tb2:grid-cols-[minmax(0,1fr)_minmax(0,3fr)]': layout === '25-75',
      'grid-cols-1 tb2:grid-cols-[minmax(0,2fr)_minmax(0,1fr)]': layout === '67-33',
      'grid-cols-1 tb2:grid-cols-[minmax(0,1fr)_minmax(0,2fr)]': layout === '33-67',
      'grid-cols-1 tb1:grid-cols-2': layout === '50-50',
      'grid-cols-1 tb1:grid-cols-2 tb2:grid-cols-3': layout === '33-34-33',
      'grid-cols-1 tb1:grid-cols-2 tb2:grid-cols-4': layout === '25-25-25-25',
      'max-w-3xl': layout === 'text'
    },
    className
  );
  return <div className={classes}>{children}</div>;
};

interface ComponentsLayoutProps extends GridLayoutProps {
  data?: { [key: string]: any };
  grayBg?: boolean;
  withBorder?: boolean;
  field_components?: any;
}

export default function ComponentsLayout({
  data,
  layout = 'full',
  grayBg = false,
  withBorder = false,
  className,
  field_components,
  ...props
}: ComponentsLayoutProps) {
  const [show, setShowSection] = useState(true);
  const config = data?.behavior_settings?.layout_paragraphs?.config;
  layout = !!config?.column_widths ? config.column_widths : layout;
  grayBg = config?.layout_bg_color === 'bg-grey' ? true : grayBg;
  withBorder =
    config?.layout_custom_border?.length && config?.layout_custom_border[0] === 'with-border'
      ? true
      : withBorder;

  const classes = classNames(
    'section relative z-10 py-8',
    {
      'bg-neutral-90 before:absolute before:bg-neutral-90 before:h-full before:w-[200vw] before:-translate-x-1/2 before:top-0 before:-z-10':
        grayBg,
      'first:pt-0': !grayBg
    },
    className
  );
  const layoutColumnNumber = layout.split('-').length;

  const dataToRender = useMemo(() => {
    const filterByColumn = (column) =>
      data?.paragraph_childs?.filter(
        (component) => component?.behavior_settings?.layout_paragraphs?.region === column
      );

    const dataToRenderPrep: [][] = [];
    dataToRenderPrep.push(layout === 'full' ? data?.paragraph_childs : filterByColumn('first'));
    dataToRenderPrep.push(filterByColumn('second'));
    dataToRenderPrep.push(filterByColumn('third'));
    dataToRenderPrep.push(filterByColumn('forth'));
    return dataToRenderPrep;
  }, [data?.paragraph_childs, layout]);

  const columnsWidths: {
    [key in keyof GridLayoutProps['layout']]: FieldComponentsProps['columnWidth'][];
  } = {
    full: ['full'],
    '67-33': ['2/3', '1/3'],
    '75-25': ['3/4', '1/4'],
    '25-75': ['1/4', '3/4'],
    '33-67': ['1/3', '2/3'],
    '50-50': ['1/2', '1/2'],
    '33-34-33': ['1/3', '1/3', '1/3'],
    '25-25-25-25': ['1/4', '1/4', '1/4', '1/4']
  };

  useEffect(() => {
    let showSection = true;
    if (
      config?.layout_operating_system &&
      !!Object.entries(config?.layout_operating_system).length &&
      !!navigator?.userAgent
    ) {
      const parser = new UAParser(navigator.userAgent);
      const currentOSName = parser?.getOS().name.toLowerCase();
      showSection = false;

      config?.layout_operating_system?.map((os) => {
        if (
          os === currentOSName ||
          (os === 'linux' && isLinuxOS(currentOSName)) ||
          (os === 'mac' && currentOSName === 'mac os')
        ) {
          showSection = true;
        }
      });
    }
    setShowSection(showSection);
  }, [config]);

  return (
    <>
      {show && (
        <GridLayout layout={layout} className={classes} {...props}>
          {!!data &&
            dataToRender
              .slice(0, layoutColumnNumber)
              .map((column, index) => (
                <FieldComponents
                  className={!!withBorder ? 'idsk-anchor-card gap-2' : 'gap-8'}
                  components={column}
                  field_components={field_components}
                  key={index}
                  columnWidth={columnsWidths[layout][index]}
                />
              ))}
        </GridLayout>
      )}
    </>
  );
}
