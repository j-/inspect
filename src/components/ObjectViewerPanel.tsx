import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';
import Paper, { type PaperProps } from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import { ThemeProvider } from '@mui/material/styles';
import Typography from '@mui/material/Typography';
import { ClientOnly } from '@tanstack/react-router';
import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type FC,
  type ReactNode,
} from 'react';
import { ErrorBoundary } from 'react-error-boundary';
import { ActionSection, type ActionSectionProps } from './ActionSection';
import type { Resource, ResourceState } from '#/resource';
import { codeTheme } from '#/theme';
import type { FilterKeysPredicate, IsExpandedFunction } from '#/viewer/types';
import { Viewer } from '#/viewer/Viewer';

export type ObjectViewerPanelProps = Omit<PaperProps, 'resource'> & {
  id: string;
  heading?: ReactNode;
  name?: string;
  resource?: Resource;
  actions?: ActionSectionProps[];
  onClear?: () => void;
  defaultIsExpanded?: IsExpandedFunction;
  filterKeys?: FilterKeysPredicate;
  useGetThisObject?: () => unknown;
};

const ObjectViewerPanelInner: FC<ObjectViewerPanelProps> = ({
  id,
  name,
  resource,
  actions,
  onClear,
  defaultIsExpanded,
  filterKeys,
  useGetThisObject,
}) => {
  const [state, setState] = useState<ResourceState>(() =>
    resource?.autoEvaluate ? { status: 'pending' } : { status: 'idle' },
  );
  const [viewerKey, setViewerKey] = useState(0);
  const valueCleanupRef = useRef<(() => void) | undefined>(undefined);
  const doEvaluateRef = useRef<(() => Promise<void>) | undefined>(undefined);

  // Core async evaluation — no synchronous setState. Safe to call from effects
  // and subscription callbacks.
  const doEvaluate = useCallback(async () => {
    if (!resource) return;

    // Tear down any subscription attached to the previous value.
    valueCleanupRef.current?.();
    valueCleanupRef.current = undefined;

    try {
      const value = await resource.evaluate();

      if (resource.createValueSubscription) {
        // Create a stable wrapper so removeEventListener can match the same ref.
        const trigger = () => doEvaluateRef.current?.();
        valueCleanupRef.current = resource.createValueSubscription(value, trigger);
      }

      setState({ status: 'success', value, evaluatedAt: Date.now() });
      setViewerKey((k) => k + 1);
    } catch (error) {
      setState({ status: 'error', error, evaluatedAt: Date.now() });
    }
  }, [resource]);

  // Keep the ref in sync so value-subscription triggers always call the latest
  // version of doEvaluate (important if resource ever changes).
  useEffect(() => {
    doEvaluateRef.current = doEvaluate;
  }, [doEvaluate]);

  // Tear down the value subscription when the component unmounts.
  useEffect(() => {
    return () => {
      valueCleanupRef.current?.();
    };
  }, []);

  // Manual re-evaluation — shows the pending state first, then evaluates.
  // Not called from effects.
  const runEvaluate = useCallback(() => {
    setState({ status: 'pending' });
    void doEvaluate();
  }, [doEvaluate]);

  useEffect(() => {
    if (resource?.autoEvaluate) {
      // State is already initialized to 'pending'. Schedule via queueMicrotask
      // so setState isn't called synchronously within the effect body.
      queueMicrotask(() => void doEvaluate());
    }
    return resource?.createSubscription?.(doEvaluate);
  }, [doEvaluate, resource]);

  const hasResource = resource != null;
  const isIdle = state.status === 'idle';
  const isPending = state.status === 'pending';
  const isSuccess = state.status === 'success';
  const isError = state.status === 'error';

  return (
    <Stack gap={2}>
      {hasResource && (
        <Stack direction="row" gap={1} flexWrap="wrap" alignItems="center">
          {isIdle ? (
            <Button
              size="small"
              variant="outlined"
              onClick={runEvaluate}
            >
              {resource.label ?? 'Evaluate'}
            </Button>
          ) : (
            <Button
              size="small"
              variant="outlined"
              onClick={runEvaluate}
              disabled={isPending}
            >
              Re-evaluate
            </Button>
          )}

          {isSuccess && (
            <>
              <Button
                size="small"
                variant="outlined"
                onClick={() => console.log(state.value)}
              >
                Log to console
              </Button>

              <Button
                size="small"
                variant="outlined"
                onClick={async () => {
                  try {
                    const json = JSON.stringify(state.value, null, 2);
                    await navigator.clipboard.writeText(json);
                  } catch {
                    // TODO: Show error
                  }
                }}
              >
                Copy to clipboard
              </Button>
            </>
          )}

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

          {isPending && <CircularProgress size={16} />}
        </Stack>
      )}

      {isError && (
        <Box color="error.main">
          <strong>Error:</strong>{' '}
          {state.error instanceof Error
            ? state.error.message
            : String(state.error)}
        </Box>
      )}

      {isSuccess && (
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
                key={viewerKey}
                object={state.value}
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
  resource,
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
              resource={resource}
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
