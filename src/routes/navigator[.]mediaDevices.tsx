import Stack from '@mui/material/Stack';
import { createFileRoute, useLocation } from '@tanstack/react-router';
import { ObjectViewerPanel } from '#/components/ObjectViewerPanel';
import { PermissionPanel } from '#/components/PermissionPanel';
import { eager } from '#/resource';

export const Route = createFileRoute('/navigator.mediaDevices')({
  component: RouteComponent,
});

function RouteComponent() {
  const { pathname } = useLocation();

  return (
    <Stack gap={4}>
      <PermissionPanel id={pathname + '#queryPermissionCamera'} name="camera" />

      <PermissionPanel id={pathname + '#queryPermissionMicrophone'} name="microphone" />

      <PermissionPanel id={pathname + '#queryPermissionDisplayCapture'} name="display-capture" />

      <ObjectViewerPanel
        id={pathname}
        heading="navigator.mediaDevices"
        name="navigator.mediaDevices"
        resource={eager(() => navigator.mediaDevices)}
      />
    </Stack>
  );
}
