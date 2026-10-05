import Typography from '@mui/material/Typography';
import { memo } from 'react';
import { ObjectViewURL } from './ObjectViewURL';

export type ObjectViewStringProps = {
  value: string;
};

const isURL = (maybeURL: string): boolean => {
  try {
    const url = new URL(maybeURL);
    return maybeURL === url.href;
  } catch {
    return false;
  }
};

export const ObjectViewString = memo<ObjectViewStringProps>(({ value }) => (
  isURL(value) ?
    <ObjectViewURL value={value} /> :
    <Typography
      component="span"
      fontFamily="monospace"
      color="primary"
      sx={{ whiteSpace: 'pre-wrap' }}
    >
      {JSON.stringify(value)}
    </Typography>
));

ObjectViewString.displayName = 'ObjectViewString';
