import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import Typography from '@mui/material/Typography';
import { ClientOnly } from '@tanstack/react-router';
import {
  useCallback,
  useEffect,
  useState,
  type FC,
  type ReactNode,
} from 'react';
import { ErrorBoundary } from 'react-error-boundary';
import { Viewer } from '#/viewer/Viewer';

export type ObjectViewerPanelProps = {
  id: string;
  heading?: ReactNode;
  name?: string;
  initialValue: () => any;
  reloadInterval?: number;
};

const codeTheme = createTheme({
  typography: {
    htmlFontSize: 14,
    body1: { fontSize: '0.75rem' },
  },
});

const ObjectViewerPanelInner: FC<ObjectViewerPanelProps> = ({
  id,
  name,
  initialValue,
  reloadInterval,
}) => {
  const [object, setObject] = useState(initialValue);
  const [count, setCount] = useState(0);

  const onClickReEvaluate = useCallback(() => {
    setObject(initialValue);
    setCount((c) => c + 1);
  }, [initialValue]);

  useEffect(() => {
    if (!reloadInterval) return;

    const interval = setInterval(() => {
      setObject(initialValue);
      setCount((c) => c + 1);
    }, reloadInterval);

    return () => clearInterval(interval);
  }, [initialValue, reloadInterval]);

  return (
    <Stack gap={2}>
      <Stack direction="row" gap={1}>
        <Button
          size="small"
          variant="outlined"
          onClick={onClickReEvaluate}
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

      <Box sx={{ lineHeight: '1.2em', fontFamily: 'monospace' }}>
        <ErrorBoundary
          fallbackRender={({ error }) => (
            <Box color="error.main">
              <strong>Error:</strong> {(error as Error).message}
            </Box>
          )}
        >
          <ThemeProvider theme={codeTheme}>
            <Viewer id={id} key={count} object={object} name={name} />
          </ThemeProvider>
        </ErrorBoundary>
      </Box>
    </Stack>
  );
};

export const ObjectViewerPanel: FC<ObjectViewerPanelProps> = ({
  id,
  heading,
  name,
  initialValue,
  reloadInterval,
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
            <ObjectViewerPanelInner
              id={id}
              name={name}
              initialValue={initialValue}
              reloadInterval={reloadInterval}
            />
          </ClientOnly>
        </ErrorBoundary>
      </Stack>
    </Paper>
  );
};
