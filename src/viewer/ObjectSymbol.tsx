import Typography from '@mui/material/Typography';
import { memo, type PropsWithChildren } from 'react';

export type ObjectSymbolProps = PropsWithChildren<{
  noSelect?: boolean;
}>;

export const ObjectSymbol = memo<ObjectSymbolProps>(({
  noSelect = false,
  children,
}) => {
  if (!children) {
    return null;
  }

  return (
    <Typography
      component="span"
      color="textSecondary"
      fontFamily="monospace"
      sx={{
        userSelect: noSelect ? 'none' : undefined,
      }}
    >
      {children}
    </Typography>
  );
});
