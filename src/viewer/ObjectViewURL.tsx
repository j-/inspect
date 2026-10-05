import Link from '@mui/material/Link';
import Typography from '@mui/material/Typography';
import { memo } from 'react';

export type ObjectViewURLProps = {
  value: string;
};

const unwrapDoubleQuotes = (input: string): string => {
  if (input.charAt(0) !== '"') return input;
  if (input.charAt(input.length - 1) !== '"') return input;
  return input.substring(1, input.length - 1);
};

export const ObjectViewURL = memo<ObjectViewURLProps>(({ value }) => (
  <Typography
    component="span"
    fontFamily="monospace"
    color="primary"
    sx={{ whiteSpace: 'pre-wrap' }}
  >
    "
    <Link href={value}>
      {unwrapDoubleQuotes(JSON.stringify(value))}
    </Link>
    "
  </Typography>
));

ObjectViewURL.displayName = 'ObjectViewURL';
