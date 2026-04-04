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
        <Button
          size="small"
          variant="outlined"
          onClick={() => setObject(initialValue)}
        >
          Re-evaluate
        </Button>

        <Button
          size="small"
          variant="outlined"
          onClick={() => console.log(object)}
        >
          Log result to console
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
          fallbackRender={({ error, resetErrorBoundary }) => (
            <Stack gap={2}>
              <Stack direction="row" gap={1}>
                <Button
                  size="small"
                  variant="outlined"
                  color="error"
                  onClick={resetErrorBoundary}
                >
                  Re-evaluate
                </Button>
              </Stack>

              <Box color="error.main">
                <strong>Error:</strong> {(error as Error).message}
              </Box>
            </Stack>
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
