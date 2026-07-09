import Box from '@mui/material/Box';
import type { ButtonProps } from '@mui/material/Button';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import { useId, useMemo, useState, type FC } from 'react';
import type { Resource } from '../resource';
import { ObjectViewerPanel } from './ObjectViewerPanel';

export type ActionSectionProps = {
  buttonProps: ButtonProps;
  resource: (value: unknown) => Resource;
};

export const ActionSection: FC<ActionSectionProps & { resourceValue?: unknown }> = ({
  buttonProps,
  resource,
  resourceValue,
}) => {
  const id = useId();
  const [show, setShow] = useState(false);
  const resolvedResource = useMemo(
    () => resource(resourceValue),
    [resource, resourceValue],
  );

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
          resource={resolvedResource}
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
