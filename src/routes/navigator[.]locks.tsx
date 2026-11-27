import LockOpenOutlinedIcon from '@mui/icons-material/LockOpenOutlined';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import MenuItem from '@mui/material/MenuItem';
import Stack from '@mui/material/Stack';
import { ThemeProvider } from '@mui/material/styles';
import Typography from '@mui/material/Typography';
import { createFileRoute, useLocation } from '@tanstack/react-router';
import { useEffect, useRef, useState, type FC, type ReactNode } from 'react';
import { ObjectViewerPanel } from '#/components/ObjectViewerPanel';
import { RequestOptionField } from '#/components/RequestOptionField';
import { eager } from '#/resource';
import { codeTheme } from '#/theme';
import { ObjectSymbol } from '#/viewer/ObjectSymbol';
import { ObjectViewBoolean } from '#/viewer/ObjectViewBoolean';
import { ObjectViewString } from '#/viewer/ObjectViewString';

const RouteComponent: FC = () => {
  const { pathname } = useLocation();

  return (
    <Stack gap={8}>
      <ObjectViewerPanel
        id={pathname}
        heading="navigator.locks"
        name="navigator.locks"
        resource={eager(() => navigator.locks)}
        actions={[
          {
            buttonProps: {
              children: <code>navigator.locks.query()</code>,
            },
            resource: () => eager(() => navigator.locks.query()),
          },
        ]}
      />

      {['foo', 'foo', 'bar'].map((lockName, i) => (
        <LockRequestPanel
          key={i}
          id={`${pathname}/request/${lockName}-${i}`}
          lockName={lockName}
        />
      ))}
    </Stack>
  );
};

export const Route = createFileRoute('/navigator.locks')({
  component: RouteComponent,
});

type LockRequest = {
  controller?: AbortController;
  lock?: Lock;
  settle?: (outcome: 'resolve' | 'reject') => void;
};

type LockRequestPanelProps = {
  id: string;
  lockName: string;
};

const LockRequestPanel: FC<LockRequestPanelProps> = ({ id, lockName }) => {
  const [selections, setSelections] = useState<LockOptionSelections>({
    mode: 'undefined',
    ifAvailable: 'undefined',
    steal: 'undefined',
    signal: 'undefined',
  });

  const { mode, ifAvailable, steal, signal } = selections;

  const [phase, setPhase] = useState<'idle' | 'pending' | 'held' | 'settling'>('idle');
  const [status, setStatus] = useState('');
  const [isHeld, setIsHeld] = useState(false);
  const [canAbort, setCanAbort] = useState(false);
  const active = useRef<LockRequest | null>(null);
  const withSignal = signal === 'controller.signal';
  const options: Omit<LockOptions, 'signal'> = {};

  if (mode === 'exclusive' || mode === 'shared') options.mode = mode;
  if (ifAvailable !== 'undefined') options.ifAvailable = ifAvailable === 'true';
  if (steal !== 'undefined') options.steal = steal === 'true';

  useEffect(() => () => {
    const request = active.current;
    active.current = null;
    request?.controller?.abort();
    request?.settle?.('resolve');
  }, []);

  function requestLock() {
    const previous = active.current;
    if (previous && (!withSignal || !previous.lock)) return previous.lock;

    // Release this panel's previous lock before requesting it with a fresh signal.
    previous?.settle?.('resolve');

    const controller = withSignal ? new AbortController() : undefined;
    const requestOptions = controller ? { ...options, signal: controller.signal } : options;
    const request: LockRequest = { controller };
    active.current = request;
    setCanAbort(controller !== undefined);
    setPhase('pending');
    setIsHeld(false);
    setStatus('Requesting lock…');

    // Show the callback value while the request promise is still pending.
    return new Promise<Lock | null>((showLock, showError) => {
      const run = async () => navigator.locks.request(lockName, requestOptions, (lock) => {
        if (active.current !== request) return;
        showLock(lock);
        if (!lock) return;

        return new Promise<void>((resolve, reject) => {
          request.lock = lock;
          request.settle = (outcome) => {
            if (outcome === 'resolve') resolve();
            else reject(new Error('Lock callback rejected'));
          };
          setPhase('held');
          setIsHeld(true);
          setStatus('Lock held');
        });
      });

      const finish = (message: string) => {
        if (active.current !== request) return;
        active.current = null;
        setCanAbort(false);
        request.settle?.('resolve');
        setPhase('idle');
        setIsHeld(false);
        setStatus(message);
      };

      void run().then(
        () => {
          showLock(null);
          finish(request.lock ? 'Lock released' : 'Lock unavailable');
        },
        (error: unknown) => {
          showError(error);
          finish(error instanceof Error ? `${error.name}: ${error.message}` : String(error));
        },
      );
    });
  }

  function abortRequest() {
    const request = active.current;
    if (!request?.controller || request.controller.signal.aborted) return;

    request.controller.abort();
    setCanAbort(false);
    if (request.lock) {
      setStatus('Signal aborted. Lock held until Resolve or Reject.');
    } else {
      setPhase('settling');
    }
  }

  function settleLock(outcome: 'resolve' | 'reject') {
    active.current?.settle?.(outcome);
    setPhase('settling');
  }

  return (
    <Stack gap={1}>
      <LockRequestOptions
        id={id}
        disabled={phase !== 'idle'}
        selections={selections}
        onChange={(name, value) => setSelections((current) => ({ ...current, [name]: value }))}
      />

      <ObjectViewerPanel
        id={id}
        heading={
          <LockRequestHeading
            lockName={lockName}
            options={options}
            withSignal={withSignal}
          />
        }
        resource={{ autoEvaluate: false, evaluate: requestLock, label: 'Request lock' }}
      />

      <Stack direction="row" gap={1} flexWrap="wrap">
        <Button
          size="small"
          variant="outlined"
          disabled={!canAbort || phase === 'settling'}
          onClick={abortRequest}
        >
          Abort
        </Button>
        <Button size="small" variant="outlined" disabled={phase !== 'held'} onClick={() => settleLock('resolve')}>
          Resolve
        </Button>
        <Button size="small" variant="outlined" disabled={phase !== 'held'} onClick={() => settleLock('reject')}>
          Reject
        </Button>
      </Stack>

      <LockRequestStatus status={status} isHeld={isHeld} />
    </Stack>
  );
};

type LockRequestStatusProps = {
  status: string;
  isHeld: boolean;
};

const LockRequestStatus: FC<LockRequestStatusProps> = ({ status, isHeld }) => {
  if (!status) return null;

  return (
    <Typography variant="body2" role="status" sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
      {isHeld ? (
        <LockOutlinedIcon fontSize="inherit" titleAccess="Lock held" />
      ) : (
        <LockOpenOutlinedIcon fontSize="inherit" titleAccess="Lock not held" />
      )}
      {status}
    </Typography>
  );
};

type LockOptionSelections = Record<keyof LockOptions, string>;

type LockRequestOptionsProps = {
  id: string;
  disabled: boolean;
  selections: LockOptionSelections;
  onChange: (name: keyof LockOptionSelections, value: string) => void;
};

const LockRequestOptions: FC<LockRequestOptionsProps> = ({ id, disabled, selections, onChange }) => (
  <Stack direction="row" gap={1} flexWrap="wrap">
    <LockOptionSelect
      id={id}
      name="mode"
      value={selections.mode}
      disabled={disabled}
      onChange={(value) => onChange('mode', value)}
    >
      <MenuItem value="exclusive"><ObjectViewString value="exclusive" /></MenuItem>
      <MenuItem value="shared"><ObjectViewString value="shared" /></MenuItem>
    </LockOptionSelect>

    <LockOptionSelect
      id={id}
      name="ifAvailable"
      value={selections.ifAvailable}
      disabled={disabled}
      onChange={(value) => onChange('ifAvailable', value)}
    >
      <MenuItem value="false"><ObjectViewBoolean value={false} /></MenuItem>
      <MenuItem value="true"><ObjectViewBoolean value={true} /></MenuItem>
    </LockOptionSelect>

    <LockOptionSelect
      id={id}
      name="steal"
      value={selections.steal}
      disabled={disabled}
      onChange={(value) => onChange('steal', value)}
    >
      <MenuItem value="false"><ObjectViewBoolean value={false} /></MenuItem>
      <MenuItem value="true"><ObjectViewBoolean value={true} /></MenuItem>
    </LockOptionSelect>

    <LockOptionSelect
      id={id}
      name="signal"
      value={selections.signal}
      disabled={disabled}
      onChange={(value) => onChange('signal', value)}
    >
      <MenuItem value="controller.signal">
        <ObjectSymbol>controller.signal</ObjectSymbol>
      </MenuItem>
    </LockOptionSelect>
  </Stack>
);

type LockOptionSelectProps = {
  id: string;
  name: keyof LockOptions;
  value: string;
  disabled: boolean;
  onChange: (value: string) => void;
  children: ReactNode;
};

const LockOptionSelect: FC<LockOptionSelectProps> = ({
  id,
  name,
  value,
  disabled,
  onChange,
  children,
}) => {
  const longestOption = {
    mode: '"exclusive"',
    ifAvailable: 'undefined',
    steal: 'undefined',
    signal: 'controller.signal',
  }[name];

  return (
    <RequestOptionField
      id={`${id}/${name}`}
      label={name}
      value={value}
      disabled={disabled}
      longestValue={longestOption}
      onChange={onChange}
    >
      {children}
    </RequestOptionField>
  );
};

type LockRequestHeadingProps = {
  lockName: string;
  options: Omit<LockOptions, 'signal'>;
  withSignal: boolean;
};

const LockRequestHeading: FC<LockRequestHeadingProps> = ({
  lockName,
  options,
  withSignal,
}) => {
  const entries = Object.entries(options);
  const hasOptions = entries.length > 0 || withSignal;

  return (
    <ThemeProvider theme={codeTheme}>
      <Box
        component="code"
        sx={{
          display: 'block',
          overflowX: 'auto',
          whiteSpace: 'pre',
          fontFamily: 'monospace',
          fontSize: (theme) => theme.typography.body1.fontSize,
          lineHeight: 1.5,
          '& .method': { color: 'secondary.dark' },
          '& .property': { color: 'primary.dark' },
        }}
      >
        navigator.locks.<span className="method">request</span>(
        <ObjectViewString value={lockName} />

        {!hasOptions ? null : (
          <>
            {', '}
            <LockRequestHeadingOptions entries={entries} withSignal={withSignal} />
          </>
        )}

        {')'}
      </Box>
    </ThemeProvider>
  );
};

type LockRequestHeadingOptionsProps = {
  entries: [string, string | boolean][];
  withSignal: boolean;
};

const LockRequestHeadingOptions: FC<LockRequestHeadingOptionsProps> = ({ entries, withSignal }) => (
  <>
    {'{\n'}

    {entries.map(([name, value]) => (
      <span key={name}>
        {'  '}
        <span className="property">{name}</span>
        {': '}
        {typeof value === 'string' ? <ObjectViewString value={value} /> : <ObjectViewBoolean value={value} />}
        <ObjectSymbol>,</ObjectSymbol>
        {'\n'}
      </span>
    ))}

    {withSignal && (
      <>
        {'  '}
        <span className="property">signal</span>
        {': '}
        <ObjectSymbol>controller.signal,</ObjectSymbol>
        {'\n'}
      </>
    )}

    {'}'}
  </>
);
