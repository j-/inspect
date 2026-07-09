import Stack from '@mui/material/Stack';
import { createFileRoute, useLocation } from '@tanstack/react-router';
import { ObjectViewerPanel } from '#/components/ObjectViewerPanel';
import { eager, reactive } from '#/resource';

export const Route = createFileRoute('/navigator.mediaDevices')({
  component: RouteComponent,
});

function RouteComponent() {
  const { pathname } = useLocation();

  return (
    <Stack gap={4}>
      <ObjectViewerPanel
        id={pathname + '#queryPermissionCamera'}
        heading={'"camera" permission'}
        resource={reactive(() => (
          navigator.permissions.query({
            name: 'camera' as PermissionName,
          })
        ), 'change')}
      />

      <ObjectViewerPanel
        id={pathname + '#queryPermissionMicrophone'}
        heading={'"microphone" permission'}
        resource={reactive(() => (
          navigator.permissions.query({
            name: 'microphone' as PermissionName,
          })
        ), 'change')}
      />

      <ObjectViewerPanel
        id={pathname + '#queryPermissionDisplayCapture'}
        heading={'"display-capture" permission'}
        resource={reactive(() => (
          navigator.permissions.query({
            name: 'display-capture' as PermissionName,
          })
        ), 'change')}
      />

      <ObjectViewerPanel
        id={pathname}
        heading="navigator.mediaDevices"
        name="navigator.mediaDevices"
        resource={eager(() => navigator.mediaDevices)}
      />
    </Stack>
  );
}
