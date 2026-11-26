import Stack from '@mui/material/Stack';
import { createFileRoute, useLocation } from '@tanstack/react-router';
import { ObjectViewerPanel } from '#/components/ObjectViewerPanel';
import { PermissionPanel } from '#/components/PermissionPanel';
import { eager } from '#/resource';

export const Route = createFileRoute('/navigator.storage')({
  component: RouteComponent,
});

function RouteComponent() {
  const { pathname } = useLocation();

  return (
    <Stack gap={4}>
      <PermissionPanel id={pathname + '#persistent-storage'} name="persistent-storage" />

      <ObjectViewerPanel
        id={pathname}
        heading="navigator.storage"
        name="navigator.storage"
        resource={eager(() => navigator.storage)}
      />
    </Stack>
  );
}
