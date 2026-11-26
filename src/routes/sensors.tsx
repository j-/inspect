import Button from '@mui/material/Button';
import MenuItem from '@mui/material/MenuItem';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import { createFileRoute, useLocation } from '@tanstack/react-router';
import { useEffect, useMemo, useRef, useState, type FC } from 'react';
import { ObjectViewerPanel } from '#/components/ObjectViewerPanel';
import { PermissionPanel } from '#/components/PermissionPanel';
import { onEvent } from '#/resource';

// Orientation sensors require permission for each sensor used in their fusion.
// https://w3c.github.io/sensors/#extending-the-permission-api
const sensorPermissions = {
  Accelerometer: ['accelerometer'],
  LinearAccelerationSensor: ['accelerometer'],
  GravitySensor: ['accelerometer'],
  Gyroscope: ['gyroscope'],
  Magnetometer: ['magnetometer'],
  AbsoluteOrientationSensor: ['accelerometer', 'gyroscope', 'magnetometer'],
  RelativeOrientationSensor: ['accelerometer', 'gyroscope'],
  AmbientLightSensor: ['ambient-light-sensor'],
  ProximitySensor: ['proximity'],
} as const;

type SensorName = keyof typeof sensorPermissions;

interface SensorInstance extends EventTarget {
  start(): void;
  stop(): void;
}

type SensorConstructor = new (options?: { frequency?: number }) => SensorInstance;

const RouteComponent: FC = () => {
  const { pathname } = useLocation();
  const [name, setName] = useState<SensorName>('Accelerometer');

  return (
    <Stack gap={4}>
      <TextField
        id="sensor-type"
        select
        label="Sensor"
        size="small"
        value={name}
        onChange={(event) => setName(event.target.value as SensorName)}
        sx={{ alignSelf: 'start', minWidth: '24ch' }}
      >
        {Object.keys(sensorPermissions).map((name) => (
          <MenuItem key={name} value={name}><code>{name}</code></MenuItem>
        ))}
      </TextField>

      <SensorPanel key={name} id={`${pathname}#${name}`} name={name} />

      {sensorPermissions[name].map((permission) => (
        <PermissionPanel key={permission} id={`${pathname}#${permission}`} name={permission} />
      ))}
    </Stack>
  );
};

export const Route = createFileRoute('/sensors')({
  component: RouteComponent,
});

type SensorPanelProps = {
  id: string;
  name: SensorName;
};

type SensorStatus =
  | { kind: 'idle' | 'starting' | 'active' | 'stopped' }
  | { kind: 'error'; message: string };

const sensorStatusLabels = {
  idle: 'Ready to start',
  starting: 'Waiting for sensor activation…',
  active: 'Sensor active',
  stopped: 'Sensor stopped',
};

const SensorPanel: FC<SensorPanelProps> = ({ id, name }) => {
  const [frequency, setFrequency] = useState('');
  const [sensor, setSensor] = useState<SensorInstance>();
  const [status, setStatus] = useState<SensorStatus>({ kind: 'idle' });
  const stopRef = useRef<(() => void) | null>(null);
  const running = status.kind === 'starting' || status.kind === 'active';

  useEffect(() => () => stopRef.current?.(), []);

  // Refresh the same sensor object on events and once more when it stops.
  const displayedSensor = useMemo(() => {
    if (!sensor) return undefined;
    return onEvent(
      () => sensor,
      () => running ? sensor : null,
      'reading',
      'activate',
    );
  }, [sensor, running]);

  const stopSensor = () => {
    stopRef.current?.();
    stopRef.current = null;
  };

  const reportError = (error: unknown) => {
    stopSensor();
    setStatus({
      kind: 'error',
      message: error instanceof Error ? `${error.name}: ${error.message}` : String(error),
    });
  };

  const startSensor = () => {
    stopSensor();
    setSensor(undefined);

    try {
      const constructors = window as Window & Partial<Record<SensorName, SensorConstructor>>;
      const Constructor = constructors[name];
      if (typeof Constructor !== 'function') {
        setStatus({ kind: 'error', message: `${name} is unavailable in this browser.` });
        return;
      }

      const nextSensor = frequency === '' ? new Constructor() : new Constructor({ frequency: Number(frequency) });
      const listeners = new AbortController();
      stopRef.current = () => {
        listeners.abort();
        nextSensor.stop();
      };

      const eventOptions = { signal: listeners.signal };
      nextSensor.addEventListener('activate', () => setStatus({ kind: 'active' }), eventOptions);
      nextSensor.addEventListener('error', (event) => {
        reportError((event as Event & { error: DOMException }).error);
      }, eventOptions);

      setStatus({ kind: 'starting' });
      nextSensor.start();
      setSensor(nextSensor);
    } catch (error) {
      reportError(error);
    }
  };

  return (
    <Stack gap={1}>
      <Stack direction="row" gap={1} alignItems="center" flexWrap="wrap">
        <TextField
          id={`${id}-frequency`}
          label="Frequency (Hz)"
          placeholder="Default"
          size="small"
          type="number"
          value={frequency}
          disabled={running}
          onChange={(event) => setFrequency(event.target.value)}
          slotProps={{ htmlInput: { step: 'any' } }}
          sx={{ width: '16ch' }}
        />
        <Button size="small" variant="outlined" disabled={running} onClick={startSensor}>Start</Button>
        <Button
          size="small"
          variant="outlined"
          disabled={!running}
          onClick={() => {
            stopSensor();
            setStatus({ kind: 'stopped' });
          }}
        >
          Stop
        </Button>
      </Stack>

      <Typography role="status" variant="body2" color={status.kind === 'error' ? 'error' : 'text.secondary'}>
        {status.kind === 'error' ? status.message : sensorStatusLabels[status.kind]}
      </Typography>

      <ObjectViewerPanel id={id} heading={<code>{name}</code>} name="sensor" resource={displayedSensor} />
    </Stack>
  );
};
