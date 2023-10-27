import { NodeFAQ } from 'components/node-types/NodeFAQ';
import { useTranslation } from 'next-i18next';

export default function ParagraphRelatedFAQ(props) {
  const { t } = useTranslation('common');

  const { relatedFAQ } = props;
  const faqs = relatedFAQ?.filter(({ type }) => type === 'node--faq');
  return (
    <>
      {!!faqs?.length && (
        <div>
          <h2 className="py-8">{props?.field_title ?? t('faq.title')}</h2>
          <div className="grid gap-5">
            {faqs.map((faq) => {
              return faq?.title && faq?.field_faq_answer ? (
                <NodeFAQ key={faq?.id} node={faq} />
              ) : (
                <></>
              );
            })}
          </div>
        </div>
      )}
    </>
  );
}
