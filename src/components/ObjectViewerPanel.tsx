import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Paper, { type PaperProps } from '@mui/material/Paper';
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
import { ActionSection, type ActionSectionProps } from './ActionSection';
import type { FilterKeysPredicate, IsExpandedFunction } from '#/viewer/types';
import { Viewer } from '#/viewer/Viewer';

export type ObjectViewerPanelProps = PaperProps & {
  id: string;
  heading?: ReactNode;
  name?: string;
  initialValue?: () => any;
  reloadInterval?: number;
  actions?: ActionSectionProps[];
  onClear?: () => void;
  defaultIsExpanded?: IsExpandedFunction;
  filterKeys?: FilterKeysPredicate;
  useGetThisObject?: () => unknown;
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
  actions,
  onClear,
  defaultIsExpanded,
  filterKeys,
  useGetThisObject,
}) => {
  const hasInitialValue = typeof initialValue === 'function';
  const [object, setObject] = useState(initialValue);
  const [count, setCount] = useState(0);

  const onClickReRender = useCallback(() => {
    setCount((c) => c + 1);
  }, []);

  const onClickReEvaluate = useCallback(() => {
    setObject(initialValue);
    setCount((c) => c + 1);
  }, [initialValue]);

  useEffect(() => {
    if (!reloadInterval || !hasInitialValue) return;

    const interval = setInterval(() => {
      setObject(initialValue);
      setCount((c) => c + 1);
    }, reloadInterval);

    return () => clearInterval(interval);
  }, [hasInitialValue, initialValue, reloadInterval]);

  return (
    <Stack gap={2}>
      {hasInitialValue && (
        <Stack direction="row" gap={1} flexWrap="wrap">
          <Button
            size="small"
            variant="outlined"
            onClick={onClickReRender}
          >
            Re-render
          </Button>

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

          <Button
            size="small"
            variant="outlined"
            onClick={async () => {
              try {
                const json = JSON.stringify(object, null, 2);
                await navigator.clipboard.writeText(json);
              } catch {
                // TODO: Show error
              }
            }}
          >
            Copy object to clipboard
          </Button>

          {onClear && (
            <Button
              size="small"
              variant="outlined"
              color="inherit"
              onClick={onClear}
            >
              Clear
            </Button>
          )}
        </Stack>
      )}

      {hasInitialValue && (
        <Box sx={{ lineHeight: '1.2em', fontFamily: 'monospace' }}>
          <ErrorBoundary
            fallbackRender={({ error }) => (
              <Box color="error.main">
                <strong>Error:</strong> {(error as Error).message}
              </Box>
            )}
          >
            <ThemeProvider theme={codeTheme}>
              <Viewer
                id={id}
                key={count}
                object={object}
                name={name}
                defaultIsExpanded={defaultIsExpanded}
                filterKeys={filterKeys}
                useGetThisObject={useGetThisObject}
              />
            </ThemeProvider>
          </ErrorBoundary>
        </Box>
      )}

      {actions && (
        <Stack gap={1}>
          {actions.map((action, index) => (
            <ActionSection key={index} {...action} />
          ))}
        </Stack>
      )}
    </Stack>
  );
};

export const ObjectViewerPanel: FC<ObjectViewerPanelProps> = ({
  id,
  heading,
  name,
  initialValue,
  reloadInterval,
  actions,
  onClear,
  defaultIsExpanded,
  filterKeys,
  useGetThisObject,
  ...props
}) => {
  return (
    <Paper sx={{ p: 2 }} {...props}>
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
              actions={actions}
              onClear={onClear}
              defaultIsExpanded={defaultIsExpanded}
              filterKeys={filterKeys}
              useGetThisObject={useGetThisObject}
            />
          </ClientOnly>
        </ErrorBoundary>
      </Stack>
    </Paper>
  );
};
