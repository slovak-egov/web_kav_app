import classNames from 'classnames';
import { GridLayout } from 'components';

export default function TitleSection({
  title,
  perex,
  grayBg = false,
  layoutFull = false,
  className = '',
  titleWhite = false
}) {
  const classes = classNames(
    'idsk-page-layout__heading__title',
    {
      'idsk-page-layout__heading__title-gray': grayBg,
      'pt-24': titleWhite
    },
    className
  );

  return (
    <GridLayout layout={layoutFull ? 'full' : 'text'} className={classes}>
      <div className={classNames({ 'pb-6': !grayBg, 'pb-14': grayBg })}>
        {!!title && <h1 className={classNames({ 'text-white': titleWhite })}>{title}</h1>}
        {!!perex && <div className="idsk-subtitle pt-8">{perex}</div>}
      </div>
    </GridLayout>
  );
}
