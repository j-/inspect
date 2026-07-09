import Stack from '@mui/material/Stack';
import { createFileRoute, useLocation } from '@tanstack/react-router';
import { ObjectViewerPanel } from '#/components/ObjectViewerPanel';
import { lazy, reactive } from '#/resource';

export const Route = createFileRoute(
  '/navigator.geolocation.getCurrentPosition()',
)({
  component: RouteComponent,
});

function RouteComponent() {
  const { pathname } = useLocation();

  return (
    <Stack gap={4}>
      <ObjectViewerPanel
        id={pathname + '#queryPermission'}
        heading="geolocation permission"
        resource={reactive(() => (
          navigator.permissions.query({
            name: 'geolocation' as PermissionName,
          })
        ), 'change')}
      />

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
