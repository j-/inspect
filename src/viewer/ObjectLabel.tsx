import Typography from '@mui/material/Typography';
import { memo, type PropsWithChildren } from 'react';

export const ObjectLabel = memo<PropsWithChildren>(({ children }) => {
  if (!children) {
    return null;
  }

  return (
    <Typography
      component="span"
      fontFamily="monospace"
      fontStyle="italic"
      color="hsl(150, 40%, 40%)"
      sx={{ userSelect: 'none' }}
    >
      {children}
    </Typography>
  );
});
