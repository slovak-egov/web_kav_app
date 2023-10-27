import { useEffect, useState } from 'react';
import { useTranslation } from 'next-i18next';
import { Typography } from '@mui/material';
import ArrowRightIcon from '@eslovensko/idsk-react/dist/assets/svgIcons/Navigation/arrow_right.svg';

export interface FieldNavigationProps {
  components: { [key: string]: any }[];
}

export default function FieldNavigation({ components }: FieldNavigationProps) {
  const { t } = useTranslation('common');
  const [sections, setSections] = useState([]);
  const [lastActive, setLastActive] = useState('');

  useEffect(() => {
    const initSection: any = [];
    components?.forEach((component) => {
      if (component.type === 'paragraph--heading') initSection.push(component.field_heading);
      if (component?.paragraph_childs?.length > 0) {
        component.paragraph_childs?.forEach((childComponent) => {
          if (childComponent.type === 'paragraph--heading')
            initSection.push(childComponent.field_heading);
        });
      }
    });
    setSections(initSection);
    setLastActive(initSection.length > 0 ? 'navigator-' + initSection[0] : '');
  }, [components]);

  const handleClickScroll = (id) => {
    const element = document.getElementById(id);
    if (element) {
      setLastActive(id);
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div>
      <Typography mb={2} variant="h5" fontWeight={'bold'}>
        {t('navigator')}
      </Typography>
      {sections.map((section, idx) => (
        <Typography
          color={lastActive === 'navigator-' + section ? '#072C66' : 'primary.main'}
          variant="body1"
          fontWeight={lastActive === 'navigator-' + section ? 'bold' : ''}
          mb={1}
          sx={{ textDecoration: 'underline', cursor: 'pointer' }}
          onClick={() => handleClickScroll('navigator-' + section)}
          key={idx}
        >
          {lastActive === 'navigator-' + section && (
            <ArrowRightIcon style={{ width: '30px', display: 'inline' }} />
          )}
          <span style={{ marginLeft: lastActive !== 'navigator-' + section ? '30px' : '' }}>
            {section}
          </span>
        </Typography>
      ))}
    </div>
  );
}
