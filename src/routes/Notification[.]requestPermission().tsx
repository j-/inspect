import Stack from '@mui/material/Stack';
import { createFileRoute, useLocation } from '@tanstack/react-router';
import { ObjectViewerPanel } from '#/components/ObjectViewerPanel.tsx';
import { PermissionPanel } from '#/components/PermissionPanel';
import { lazy } from '#/resource.ts';

export const Route = createFileRoute('/Notification.requestPermission()')({
  component: RouteComponent,
});

function RouteComponent() {
  const { pathname } = useLocation();

  return (
    <Stack gap={4}>
      <PermissionPanel id={pathname + '#queryPermission'} name="notifications" />

      <ObjectViewerPanel
        id={pathname}
        heading="Notification.requestPermission()"
        resource={lazy(
          () => Notification.requestPermission(),
        )}
      />
    </Stack>
  );
}
