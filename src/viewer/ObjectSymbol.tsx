import Typography from '@mui/material/Typography';
import { memo, type PropsWithChildren } from 'react';

export const ObjectSymbol = memo<PropsWithChildren>(({ children }) => {
  if (!children) {
    return null;
  }

  return (
    <Typography component="span" color="textSecondary" fontFamily="monospace">
      {children}
    </Typography>
  );
});
