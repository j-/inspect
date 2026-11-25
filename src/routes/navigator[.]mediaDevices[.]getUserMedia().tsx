import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import MenuItem from '@mui/material/MenuItem';
import Stack from '@mui/material/Stack';
import { ThemeProvider } from '@mui/material/styles';
import TextField from '@mui/material/TextField';
import { createFileRoute, useLocation } from '@tanstack/react-router';
import { useEffect, useRef, useState, type FC } from 'react';
import { MediaConstraintsBuilder, parseMediaConstraints, type MediaOption } from '#/components/MediaConstraintsBuilder';
import { ObjectViewerPanel } from '#/components/ObjectViewerPanel';
import { makeValueSubscription, polling } from '#/resource';
import { codeTheme } from '#/theme';
import { ObjectSymbol } from '#/viewer/ObjectSymbol';
import { ObjectViewBoolean } from '#/viewer/ObjectViewBoolean';
import { ObjectViewNull } from '#/viewer/ObjectViewNull';
import { ObjectViewNumber } from '#/viewer/ObjectViewNumber';
import { ObjectViewString } from '#/viewer/ObjectViewString';
import { ObjectViewUndefined } from '#/viewer/ObjectViewUndefined';
import { canRenderUnquotedPropertyKey } from '#/viewer/utils';

type MediaOptionValue = 'undefined' | 'false' | 'true' | 'custom';
type MediaOptions = Partial<Record<MediaOption, boolean | Record<string, unknown>>>;

const RouteComponent: FC = () => {
  const { pathname } = useLocation();
  const [audio, setAudio] = useState<MediaOptionValue>('undefined');
  const [video, setVideo] = useState<MediaOptionValue>('undefined');
  const [audioJson, setAudioJson] = useState('{}');
  const [videoJson, setVideoJson] = useState('{}');
  const audioConstraints = parseMediaConstraints(audioJson);
  const videoConstraints = parseMediaConstraints(videoJson);
  const audioValue = audio === 'custom' ? audioConstraints : audio === 'undefined' ? undefined : audio === 'true';
  const videoValue = video === 'custom' ? videoConstraints : video === 'undefined' ? undefined : video === 'true';
  const options: MediaOptions | null = audioValue === null || videoValue === null ? null : {
    ...(audioValue === undefined ? {} : { audio: audioValue }),
    ...(videoValue === undefined ? {} : { video: videoValue }),
  };

  return (
    <Stack gap={1}>
      <Stack direction="row" gap={1} flexWrap="wrap">
        <MediaOptionSelect id={pathname} name="audio" value={audio} onChange={setAudio} />
        <MediaOptionSelect id={pathname} name="video" value={video} onChange={setVideo} />
      </Stack>
      {audio === 'custom' && (
        <MediaConstraintsBuilder track="audio" json={audioJson} constraints={audioConstraints} onChange={setAudioJson} />
      )}
      {video === 'custom' && (
        <MediaConstraintsBuilder track="video" json={videoJson} constraints={videoConstraints} onChange={setVideoJson} />
      )}
      <MediaRequestPanel key={JSON.stringify(options)} id={pathname} options={options} />
    </Stack>
  );
};

export const Route = createFileRoute('/navigator.mediaDevices.getUserMedia()')({
  component: RouteComponent,
});

type MediaOptionSelectProps = {
  id: string;
  name: MediaOption;
  value: MediaOptionValue;
  onChange: (value: MediaOptionValue) => void;
};

const MediaOptionSelect: FC<MediaOptionSelectProps> = ({ id, name, value, onChange }) => (
  <ThemeProvider theme={codeTheme}>
    <TextField
      id={`${id}/${name}`}
      select
      size="small"
      label={<code>{name}</code>}
      value={value}
      onChange={(event) => onChange(event.target.value as MediaOptionValue)}
      sx={(theme) => ({
        fontFamily: 'monospace',
        fontSize: theme.typography.body1.fontSize,
        width: 'calc(9ch + 48px)',
        flexShrink: 0,
        '& .MuiSelect-select': { py: 0.5 },
        ...(value === 'undefined' && {
          '& .MuiSelect-select .MuiTypography-root': { color: 'text.secondary' },
          '& .MuiInputLabel-root:not(.Mui-focused)': { color: 'text.secondary' },
          '& .MuiOutlinedInput-root:not(:hover):not(.Mui-focused) .MuiOutlinedInput-notchedOutline': {
            borderColor: 'divider',
          },
        }),
      })}
    >
      <MenuItem value="undefined"><ObjectViewUndefined /></MenuItem>
      <MenuItem value="false"><ObjectViewBoolean value={false} /></MenuItem>
      <MenuItem value="true"><ObjectViewBoolean value={true} /></MenuItem>
      <MenuItem value="custom">Custom…</MenuItem>
    </TextField>
  </ThemeProvider>
);

type MediaRequestPanelProps = {
  id: string;
  options: MediaOptions | null;
};

const subscribeToStream = makeValueSubscription<MediaStream>('active', 'addtrack', 'inactive', 'removetrack');

const trackMethods = ['getTracks', 'getAudioTracks', 'getVideoTracks'] as const;

type MediaRequest = {
  stream?: MediaStream;
};

const MediaRequestPanel: FC<MediaRequestPanelProps> = ({ id, options }) => {
  const activeRequest = useRef<MediaRequest | null>(null);
  const [canStop, setCanStop] = useState(false);

  const stopCapture = () => {
    const request = activeRequest.current;
    activeRequest.current = null;
    request?.stream?.getTracks().forEach((track) => track.stop());
  };

  useEffect(() => stopCapture, []);

  const requestMedia = async () => {
    if (!options) throw new TypeError('Enter valid media constraints');

    stopCapture();
    const request: MediaRequest = {};
    activeRequest.current = request;
    setCanStop(false);

    const stream = await (Object.keys(options).length
      ? navigator.mediaDevices.getUserMedia(options)
      : navigator.mediaDevices.getUserMedia());

    if (activeRequest.current !== request) {
      stream.getTracks().forEach((track) => track.stop());
      throw new DOMException('Media request was superseded', 'AbortError');
    }

    request.stream = stream;
    setCanStop(true);
    return stream;
  };

  const subscribeToActiveStream = (stream: unknown, update: () => void) =>
    subscribeToStream(stream, () => {
      if (activeRequest.current?.stream === stream) update();
    });

  return (
    <Stack gap={1}>
      <ObjectViewerPanel
        id={id}
        heading={<MediaRequestHeading options={options} />}
        name="navigator.mediaDevices.getUserMedia()"
        resource={options ? {
          autoEvaluate: false,
          evaluate: requestMedia,
          createValueSubscription: subscribeToActiveStream,
        } : undefined}
        actions={options ? trackMethods.map((method) => ({
          buttonProps: { children: <code>result.{method}()</code> },
          resource: (stream: unknown) => polling(() => (stream as MediaStream)[method](), 1000),
        })) : undefined}
      />
      <Stack direction="row" gap={1} flexWrap="wrap">
        <Button
          size="small"
          variant="outlined"
          disabled={!canStop}
          onClick={() => {
            stopCapture();
            setCanStop(false);
          }}
        >
          Stop
        </Button>
      </Stack>
    </Stack>
  );
};

type MediaRequestHeadingProps = {
  options: MediaOptions | null;
};

const MediaRequestHeading: FC<MediaRequestHeadingProps> = ({ options }) => {
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
        navigator.mediaDevices.<span className="method">getUserMedia</span>(
        {options && Object.keys(options).length > 0 ? <MediaConstraintCode value={options} /> : null}
        {options ? ')' : '…)'}
      </Box>
    </ThemeProvider>
  );
};

type MediaConstraintCodeProps = {
  value: unknown;
  depth?: number;
};

const MediaConstraintCode: FC<MediaConstraintCodeProps> = ({ value, depth = 0 }) => {
  if (value === null) return <ObjectViewNull />;
  if (typeof value === 'boolean') return <ObjectViewBoolean value={value} />;
  if (typeof value === 'number') return <ObjectViewNumber value={value} />;
  if (typeof value === 'string') return <ObjectViewString value={value} />;
  if (typeof value !== 'object') return <ObjectViewUndefined />;

  const isArray = Array.isArray(value);
  const entries = Object.entries(value);
  return (
    <>
      {isArray ? '[' : '{'}
      {entries.length > 0 && '\n'}
      {entries.map(([name, item]) => (
        <span key={name}>
          {'  '.repeat(depth + 1)}
          {!isArray && (
            <>
              <span className="property">{canRenderUnquotedPropertyKey(name) ? name : JSON.stringify(name)}</span>
              {': '}
            </>
          )}
          <MediaConstraintCode value={item} depth={depth + 1} />
          <ObjectSymbol>,</ObjectSymbol>
          {'\n'}
        </span>
      ))}
      {entries.length > 0 && '  '.repeat(depth)}
      {isArray ? ']' : '}'}
    </>
  );
};
