import Button, { type ButtonProps } from '@mui/material/Button';
import { type FC } from 'react';

type ObjectViewObjectProps = Partial<ButtonProps>;

export const ObjectCollapseToggleButton: FC<ObjectViewObjectProps> = (
  props,
) => {
  return (
    <Button
      size="small"
      variant="text"
      sx={{ minWidth: 0, lineHeight: 1 }}
      {...props}
    >
      &hellip;
    </Button>
  );
};

ObjectCollapseToggleButton.displayName = 'ObjectCollapseToggleButton';
