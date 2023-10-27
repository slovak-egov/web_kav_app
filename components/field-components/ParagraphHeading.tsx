import { Box } from '@mui/material';
import React from 'react';

export default function ParagraphHeading(props) {
  return (
    <Box id={'navigator-' + props.field_heading}>
      {React.createElement(props?.field_heading_level ?? 'h2', {}, props?.field_heading)}
    </Box>
  );
}
