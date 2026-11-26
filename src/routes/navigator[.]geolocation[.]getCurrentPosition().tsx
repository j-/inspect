import Stack from '@mui/material/Stack';
import { createFileRoute, useLocation } from '@tanstack/react-router';
import { ObjectViewerPanel } from '#/components/ObjectViewerPanel';
import { PermissionPanel } from '#/components/PermissionPanel';
import { lazy } from '#/resource';

export const Route = createFileRoute(
  '/navigator.geolocation.getCurrentPosition()',
)({
  component: RouteComponent,
});

function RouteComponent() {
  const { pathname } = useLocation();

  return (
    <Stack gap={4}>
      <PermissionPanel id={pathname + '#queryPermission'} name="geolocation" />

      <ObjectViewerPanel
        id={pathname}
        heading="navigator.geolocation.getCurrentPosition(resolve)"
        resource={lazy(() => {
          return new Promise((resolve, reject) => {
            navigator.geolocation.getCurrentPosition(resolve, reject);
          });
        })}
      />
    </Stack>
  );
}
