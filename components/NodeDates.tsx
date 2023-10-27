import { useTranslation } from 'next-i18next';
import { format } from 'date-fns';
import classNames from 'classnames';

export default function NodeDates({ node, className = '' }) {
  const { t } = useTranslation('common');

  const dateFormat =
    t('date.format_string') === 'date.format_string' ? 'yyyy-MM-dd' : t('date.format_string');
  const creationDate = format(new Date(node.created), dateFormat);
  const revisionDate = format(new Date(node.revision_timestamp), dateFormat);
  const classes = classNames('whitespace-nowrap text-main', className);

  return (
    <>
      {!!revisionDate && (
        <div className={classes}>
          {t('article.revision_date')}:{' '}
          <time dateTime={node.revision_timestamp}>{revisionDate}</time>
        </div>
      )}
      <div className={classes}>
        {t('article.creation_date')}: <time dateTime={node.created}>{creationDate}</time>
      </div>
    </>
  );
}
