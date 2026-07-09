import Stack from '@mui/material/Stack';
import { createFileRoute, useLocation } from '@tanstack/react-router';
import { ObjectViewerPanel } from '#/components/ObjectViewerPanel';
import { lazy, lazyReactive, polling } from '#/resource';

export const Route = createFileRoute('/navigator.mediaDevices.getUserMedia()')({
  component: RouteComponent,
});

function RouteComponent() {
  const { pathname } = useLocation();

  const actions = [
    {
      buttonProps: {
        children: 'result.getTracks()',
      },
      resource: (stream: unknown) => polling(() => (stream as MediaStream).getTracks(), 1000),
    },
    {
      buttonProps: {
        children: 'result.getAudioTracks()',
      },
      resource: (stream: unknown) => polling(() => (stream as MediaStream).getAudioTracks(), 1000),
    },
    {
      buttonProps: {
        children: 'result.getVideoTracks()',
      },
      resource: (stream: unknown) => polling(() => (stream as MediaStream).getVideoTracks(), 1000),
    },
  ];

  return (
    <Stack gap={4}>
      <ObjectViewerPanel
        id={pathname + '#getUserMedia()'}
        heading="navigator.mediaDevices.getUserMedia()"
        name="navigator.mediaDevices.getUserMedia()"
        resource={lazy(() => navigator.mediaDevices.getUserMedia())}
      />

      <ObjectViewerPanel
        id={pathname + '#getUserMedia({ audio: true })'}
        heading="navigator.mediaDevices.getUserMedia({ audio: true })"
        name="navigator.mediaDevices.getUserMedia({ audio: true })"
        resource={lazyReactive(
          () => navigator.mediaDevices.getUserMedia({ audio: true }),
          'active',
          'addtrack',
          'inactive',
          'removetrack',
        )}
        actions={actions}
      />

      <ObjectViewerPanel
        id={pathname + '#getUserMedia({ video: true })'}
        heading="navigator.mediaDevices.getUserMedia({ video: true })"
        name="navigator.mediaDevices.getUserMedia({ video: true })"
        resource={lazyReactive(
          () => navigator.mediaDevices.getUserMedia({ video: true }),
          'active',
          'addtrack',
          'inactive',
          'removetrack',
        )}
        actions={actions}
      />

      <ObjectViewerPanel
        id={pathname + '#getUserMedia({ audio: true, video: true })'}
        heading="navigator.mediaDevices.getUserMedia({ audio: true, video: true })"
        name="navigator.mediaDevices.getUserMedia({ audio: true, video: true })"
        resource={lazyReactive(
          () => navigator.mediaDevices.getUserMedia({ audio: true, video: true }),
          'active',
          'addtrack',
          'inactive',
          'removetrack',
        )}
        actions={actions}
      />
    </Stack>
  );
}
