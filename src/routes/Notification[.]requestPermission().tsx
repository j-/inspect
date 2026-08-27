import Stack from '@mui/material/Stack';
import { createFileRoute, useLocation } from '@tanstack/react-router';
import { ObjectViewerPanel } from '#/components/ObjectViewerPanel.tsx';
import { lazy, reactive } from '#/resource.ts';

export const Route = createFileRoute('/Notification.requestPermission()')({
  component: RouteComponent,
});

function RouteComponent() {
  const { pathname } = useLocation();

  return (
    <Stack gap={4}>
      <ObjectViewerPanel
        id={pathname + '#queryPermission'}
        heading="notifications permission"
        resource={reactive(() => (
          navigator.permissions.query({
            name: 'notifications' as PermissionName,
          })
        ), 'change')}
      />

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
