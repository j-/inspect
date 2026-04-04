import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { ClientOnly } from '@tanstack/react-router';
import { useState, type FC, type ReactNode } from 'react';
import { ErrorBoundary } from 'react-error-boundary';
import { Viewer } from '#/viewer/Viewer';

export type ObjectViewerPanelProps = {
  heading?: ReactNode;
  initialValue: () => any;
};

export const ObjectViewerPanelInner: FC<ObjectViewerPanelProps> = ({
  initialValue,
}) => {
  const [object, setObject] = useState(initialValue);

  return (
    <Stack gap={2}>
      <Stack direction="row" gap={1}>
        <Button variant="outlined" onClick={() => console.log(object)}>
          <pre>Log result to console</pre>
        </Button>

        <Button variant="outlined" onClick={() => setObject(initialValue)}>
          <pre>Re-evaluate</pre>
        </Button>
      </Stack>

      <Box>
        <ErrorBoundary
          fallbackRender={({ error }) => (
            <Box color="error.main">
              <strong>Error:</strong> {(error as Error).message}
            </Box>
          )}
        >
          <Viewer object={object} />
        </ErrorBoundary>
      </Box>
    </Stack>
  );
};

export const ObjectViewerPanel: FC<ObjectViewerPanelProps> = ({
  heading,
  initialValue,
}) => {
  return (
    <Paper sx={{ p: 2 }}>
      <Stack gap={1}>
        {heading && (
          <Typography variant="h6">
            {heading}
          </Typography>
        )}

        <ErrorBoundary
          fallbackRender={({ error }) => (
            <Box color="error.main">
              <strong>Error:</strong> {(error as Error).message}
            </Box>
          )}
        >
          <ClientOnly>
            <ObjectViewerPanelInner initialValue={initialValue} />
          </ClientOnly>
        </ErrorBoundary>
      </Stack>
    </Paper>
  );
};
