import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import { ThemeProvider } from '@mui/material/styles';
import { createFileRoute, useLocation } from '@tanstack/react-router';
import { type FC } from 'react';
import { ObjectViewerPanel } from '#/components/ObjectViewerPanel';
import { onEvent } from '#/resource';
import { codeTheme } from '#/theme';
import { ObjectViewString } from '#/viewer/ObjectViewString';

type TorchCapabilities = MediaTrackCapabilities & {
  torch?: boolean | boolean[];
};

const RouteComponent: FC = () => {
  const { pathname } = useLocation();

  return (
    <Stack gap={4}>
      <ObjectViewerPanel
        id={pathname}
        heading="navigator.mediaDevices.enumerateDevices()"
        resource={onEvent(
          () => navigator.mediaDevices.enumerateDevices(),
          () => navigator.mediaDevices,
          'devicechange',
        )}
      />

      <ObjectViewerPanel
        id={`${pathname}#video-torch-capabilities`}
        heading={<TorchCapabilitiesHeading />}
        resource={onEvent(
          async () => Array.from(await navigator.mediaDevices.enumerateDevices())
            .filter((device) => device.kind === 'videoinput')
            .map((device) => {
              const capabilities: TorchCapabilities | undefined = (device as InputDeviceInfo).getCapabilities?.();
              return [device.label, capabilities?.torch];
            }),
          () => navigator.mediaDevices,
          'devicechange',
        )}
      />
    </Stack>
  );
};

export const Route = createFileRoute(
  '/navigator.mediaDevices.enumerateDevices()',
)({
  component: RouteComponent,
});

const TorchCapabilitiesHeading: FC = () => (
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
        '& .keyword': { color: 'error.dark' },
      }}
    >
      Array.<span className="method">from</span>(<span className="keyword">await</span>
      {' '}navigator.mediaDevices.<span className="method">enumerateDevices</span>())
      {'\n  .'}<span className="method">filter</span>((device) =&gt; device.kind ==={' '}
      <ObjectViewString value="videoinput" />)
      {'\n  .'}<span className="method">map</span>((device) =&gt; [device.label, device.
      <span className="method">getCapabilities</span>?.()?.torch])
    </Box>
  </ThemeProvider>
);
