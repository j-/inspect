import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import { useState, type FC } from 'react';
import { ErrorBoundary } from 'react-error-boundary';
import { Viewer } from '#/viewer/Viewer';

export type ObjectViewerPanelProps = {
  initialValue: () => any;
};

export const ObjectViewerPanel: FC<ObjectViewerPanelProps> = ({
  initialValue,
}) => {
  const [object] = useState(initialValue);

  return (
    <Paper sx={{ p: 2 }}>
      <Stack gap={2}>
        <Stack direction="row" gap={1}>
          <Button variant="outlined" onClick={() => console.log(object)}>
            <pre>console.log()</pre>
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
    </Paper>
  );
};
