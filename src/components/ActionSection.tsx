import Box from '@mui/material/Box';
import type { ButtonProps } from '@mui/material/Button';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import { useId, useMemo, useState, type FC } from 'react';
import { ObjectViewerPanel } from './ObjectViewerPanel';
import { eager } from '../resource';

export type ActionSectionProps = {
  buttonProps: ButtonProps;
  initialData: () => any;
};

export const ActionSection: FC<ActionSectionProps> = ({
  buttonProps,
  initialData,
}) => {
  const id = useId();
  const [show, setShow] = useState(false);
  const resource = useMemo(() => eager(initialData), [initialData]);

  return (
    <Stack gap={1} width="100%">
      <Box>
        <Button
          {...buttonProps}
          variant="outlined"
          color="secondary"
          size="small"
          onClick={(e) => {
            buttonProps.onClick?.(e);
            setShow(true);
          }}
        />
      </Box>

      {show && (
        <ObjectViewerPanel
          id={id}
          resource={resource}
          elevation={0}
          sx={{
            p: 1,
            bgcolor: 'grey.50',
          }}
          onClear={() => setShow(false)}
        />
      )}
    </Stack>
  );
};
