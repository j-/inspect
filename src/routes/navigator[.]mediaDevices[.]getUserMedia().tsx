import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import MenuItem from '@mui/material/MenuItem';
import Stack from '@mui/material/Stack';
import { ThemeProvider } from '@mui/material/styles';
import TextField from '@mui/material/TextField';
import { createFileRoute, useLocation } from '@tanstack/react-router';
import { useEffect, useRef, useState, type FC } from 'react';
import { ObjectViewerPanel } from '#/components/ObjectViewerPanel';
import { makeValueSubscription, polling } from '#/resource';
import { codeTheme } from '#/theme';
import { ObjectSymbol } from '#/viewer/ObjectSymbol';
import { ObjectViewBoolean } from '#/viewer/ObjectViewBoolean';
import { ObjectViewUndefined } from '#/viewer/ObjectViewUndefined';

type MediaOption = 'audio' | 'video';
type MediaOptionValue = 'undefined' | 'false' | 'true';
type MediaOptions = Partial<Record<MediaOption, boolean>>;

const RouteComponent: FC = () => {
  const { pathname } = useLocation();
  const [audio, setAudio] = useState<MediaOptionValue>('undefined');
  const [video, setVideo] = useState<MediaOptionValue>('undefined');
  const options: MediaOptions = {};

  if (audio !== 'undefined') options.audio = audio === 'true';
  if (video !== 'undefined') options.video = video === 'true';

  return (
    <Stack gap={1}>
      <Stack direction="row" gap={1} flexWrap="wrap">
        <MediaOptionSelect id={pathname} name="audio" value={audio} onChange={setAudio} />
        <MediaOptionSelect id={pathname} name="video" value={video} onChange={setVideo} />
      </Stack>
      <MediaRequestPanel key={`${audio}/${video}`} id={pathname} options={options} />
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
    </TextField>
  </ThemeProvider>
);

type MediaRequestPanelProps = {
  id: string;
  options: MediaOptions;
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
        resource={{
          autoEvaluate: false,
          evaluate: requestMedia,
          createValueSubscription: subscribeToActiveStream,
        }}
        actions={trackMethods.map((method) => ({
          buttonProps: { children: <code>result.{method}()</code> },
          resource: (stream: unknown) => polling(() => (stream as MediaStream)[method](), 1000),
        }))}
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
  options: MediaOptions;
};

const MediaRequestHeading: FC<MediaRequestHeadingProps> = ({ options }) => {
  const entries = Object.entries(options);

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
        {entries.length === 0 ? null : (
          <>
            {'{\n'}
            {entries.map(([name, value]) => (
              <span key={name}>
                {'  '}
                <span className="property">{name}</span>
                {': '}
                <ObjectViewBoolean value={value} />
                <ObjectSymbol>,</ObjectSymbol>
                {'\n'}
              </span>
            ))}
            {'}'}
          </>
        )}
        {')'}
      </Box>
    </ThemeProvider>
  );
};
