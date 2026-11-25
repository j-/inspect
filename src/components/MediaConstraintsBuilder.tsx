import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import MenuItem from '@mui/material/MenuItem';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import { useId, useState, type FC, type ReactNode } from 'react';
import { ObjectViewBoolean } from '#/viewer/ObjectViewBoolean';

export type MediaOption = 'audio' | 'video';
type ConstraintObject = Record<string, unknown>;

export function parseMediaConstraints(json: string): ConstraintObject | null {
  try {
    const value: unknown = JSON.parse(json);
    return isConstraintObject(value) ? value : null;
  } catch {
    return null;
  }
}

function isConstraintObject(value: unknown): value is ConstraintObject {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

const commonConstraints = {
  audio: { echoCancellation: true, noiseSuppression: true, autoGainControl: true, channelCount: 1 },
  video: { width: 1280, height: 720, frameRate: 30 },
} satisfies Record<MediaOption, Record<string, number | boolean>>;

type MediaConstraintsBuilderProps = {
  track: MediaOption;
  json: string;
  constraints: ConstraintObject | null;
  onChange: (json: string) => void;
};

export const MediaConstraintsBuilder: FC<MediaConstraintsBuilderProps> = ({
  track,
  json,
  constraints,
  onChange,
}) => {
  const id = useId();
  const [format, setFormat] = useState<'builder' | 'json'>('builder');
  const fields = Object.entries(commonConstraints[track]);
  const current = constraints ?? {};
  const available = fields.filter(([name]) => !Object.hasOwn(current, name));
  const hasOtherFields = Object.keys(current).some((name) => !Object.hasOwn(commonConstraints[track], name));

  const save = (next: ConstraintObject) => onChange(JSON.stringify(next, null, 2));

  return (
    <Stack component="fieldset" gap={2} sx={{ m: 0, p: 2, minWidth: 0, border: 1, borderColor: 'divider' }}>
      <Box component="legend" sx={{ px: 0.5 }}><code>{track}</code> constraints</Box>
      <TextField
        id={`${id}-format`}
        select
        size="small"
        label="Edit as"
        value={format}
        onChange={(event) => setFormat(event.target.value === 'json' ? 'json' : 'builder')}
        sx={{ alignSelf: 'start', minWidth: '10ch' }}
      >
        <MenuItem value="builder" disabled={!constraints}>Builder</MenuItem>
        <MenuItem value="json">JSON</MenuItem>
      </TextField>

      {format === 'json' || !constraints ? (
        <TextField
          id={`${id}-json`}
          label={`${track} constraints JSON`}
          multiline
          minRows={3}
          maxRows={14}
          value={json}
          error={!constraints}
          helperText={!constraints ? 'Enter a valid JSON object to run the request.' : undefined}
          onChange={(event) => onChange(event.target.value)}
          slotProps={{ input: { sx: { fontFamily: 'monospace' } } }}
        />
      ) : (
        <>
          {fields.filter(([name]) => Object.hasOwn(current, name)).map(([name, defaultValue]) => (
            <ConstraintRow
              key={name}
              name={name}
              value={current[name]}
              defaultValue={defaultValue}
              onChange={(value) => save({ ...current, [name]: value })}
              onRemove={() => {
                const next = { ...current };
                delete next[name];
                save(next);
              }}
            />
          ))}
          {hasOtherFields && <Typography variant="body2">Use JSON to edit additional constraints.</Typography>}
          {available.length > 0 && (
            <TextField
              id={`${id}-add`}
              select
              size="small"
              label="Add constraint"
              value=""
              onChange={(event) => {
                const field = available.find(([name]) => name === event.target.value);
                if (field) save({ ...current, [field[0]]: field[1] });
              }}
              sx={{ alignSelf: 'start', minWidth: '15ch' }}
            >
              {available.map(([name]) => <MenuItem key={name} value={name}><code>{name}</code></MenuItem>)}
            </TextField>
          )}
        </>
      )}
    </Stack>
  );
};

type ConstraintValue = number | boolean;
type ConstraintMode = 'value' | 'ideal' | 'exact' | 'range';

type EditableConstraint =
  | { mode: 'value' | 'ideal' | 'exact'; value: ConstraintValue }
  | { mode: 'range'; value: number; bounds: { min?: number; max?: number } };

function readConstraint(value: unknown, defaultValue: ConstraintValue): EditableConstraint | null {
  if (typeof value === typeof defaultValue) {
    return { mode: 'value', value: value as ConstraintValue };
  }

  if (!isConstraintObject(value)) return null;
  const keys = Object.keys(value);
  const key = keys[0];
  if (keys.length === 1 && (key === 'ideal' || key === 'exact') && typeof value[key] === typeof defaultValue) {
    return { mode: key, value: value[key] as ConstraintValue };
  }

  if (typeof defaultValue === 'number' && keys.every((key) =>
    (key === 'min' || key === 'max') && typeof value[key] === 'number',
  )) {
    return { mode: 'range', value: defaultValue, bounds: value as { min?: number; max?: number } };
  }

  return null;
}

type ConstraintRowProps = {
  name: string;
  value: unknown;
  defaultValue: ConstraintValue;
  onChange: (value: unknown) => void;
  onRemove: () => void;
};

const ConstraintRow: FC<ConstraintRowProps> = ({ name, value, defaultValue, onChange, onRemove }) => {
  const id = useId();
  const constraint = readConstraint(value, defaultValue);
  const modeHelp = {
    value: 'Use a plain value.',
    ideal: 'Prefer this value.',
    exact: 'Require this value.',
    range: 'Require a lower bound, an upper bound, or both.',
  };

  const setMode = (mode: ConstraintMode) => {
    const current = constraint?.value ?? defaultValue;
    if (mode === 'range') onChange({ min: current });
    else if (mode === 'value') onChange(current);
    else onChange({ [mode]: current });
  };

  return (
    <Stack component="fieldset" gap={1} sx={{ m: 0, p: 1, minWidth: 0, border: 1, borderColor: 'divider' }}>
      <Box component="legend" sx={{ px: 0.5 }}><code>{name}</code></Box>
      {!constraint ? (
        <Typography variant="body2">Edit this value in JSON.</Typography>
      ) : (
        <Stack direction="row" gap={1} flexWrap="wrap" alignItems="start">
          <TextField
            id={`${id}-mode`}
            select
            size="small"
            label="Mode"
            value={constraint.mode}
            helperText={modeHelp[constraint.mode]}
            onChange={(event) => setMode(event.target.value as ConstraintMode)}
            sx={{ minWidth: '16ch' }}
          >
            <MenuItem value="value">Value</MenuItem>
            <MenuItem value="ideal"><code>ideal</code></MenuItem>
            <MenuItem value="exact"><code>exact</code></MenuItem>
            {typeof defaultValue === 'number' && <MenuItem value="range"><code>min</code> / <code>max</code></MenuItem>}
          </TextField>
          {constraint.mode === 'range' ? (
            (['min', 'max'] as const).map((bound) => (
              <ConstraintNumberInput
                key={bound}
                label={<code>{bound}</code>}
                value={constraint.bounds[bound]}
                onChange={(number) => {
                  const bounds = { ...constraint.bounds };
                  if (number === undefined) delete bounds[bound];
                  else bounds[bound] = number;
                  onChange(bounds);
                }}
              />
            ))
          ) : typeof constraint.value === 'boolean' ? (
            <TextField
              id={`${id}-boolean`}
              select
              size="small"
              label="Value"
              value={String(constraint.value)}
              onChange={(event) => {
                const next = event.target.value === 'true';
                onChange(constraint.mode === 'value' ? next : { [constraint.mode]: next });
              }}
            >
              <MenuItem value="true"><ObjectViewBoolean value={true} /></MenuItem>
              <MenuItem value="false"><ObjectViewBoolean value={false} /></MenuItem>
            </TextField>
          ) : (
            <ConstraintNumberInput
              key={constraint.mode}
              label="Value"
              value={constraint.value}
              onChange={(number) => {
                if (number !== undefined) onChange(constraint.mode === 'value' ? number : { [constraint.mode]: number });
              }}
            />
          )}
        </Stack>
      )}
      <Button size="small" sx={{ alignSelf: 'start' }} onClick={onRemove} aria-label={`Remove ${name}`}>Remove</Button>
    </Stack>
  );
};

type ConstraintNumberInputProps = {
  label: ReactNode;
  value: number | undefined;
  onChange: (value: number | undefined) => void;
};

const ConstraintNumberInput: FC<ConstraintNumberInputProps> = ({ label, value, onChange }) => {
  const id = useId();
  const [draft, setDraft] = useState<string | null>(null);

  return (
    <TextField
      id={id}
      size="small"
      type="number"
      label={label}
      value={draft ?? value ?? ''}
      onBlur={() => setDraft(null)}
      onChange={(event) => {
        const raw = event.target.value;
        setDraft(raw);
        const number = Number(raw);
        if (!raw) onChange(undefined);
        else if (Number.isFinite(number)) onChange(number);
      }}
      slotProps={{ htmlInput: { step: 'any' } }}
      sx={{ width: '13ch' }}
    />
  );
};
