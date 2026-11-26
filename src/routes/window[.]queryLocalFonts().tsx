import Stack from '@mui/material/Stack';
import { createFileRoute, useLocation } from '@tanstack/react-router';
import { ObjectViewerPanel } from '#/components/ObjectViewerPanel';
import { lazy, reactive } from '#/resource';

export const Route = createFileRoute('/window.queryLocalFonts()')({
  component: RouteComponent,
});

function RouteComponent() {
  const { pathname } = useLocation();

  return (
    <Stack gap={4}>
      <ObjectViewerPanel
        id={pathname + '#queryPermission'}
        heading="local-fonts permission"
        resource={reactive(() => (
          navigator.permissions.query({
            name: 'local-fonts' as PermissionName,
          })
        ), 'change')}
      />

      <ObjectViewerPanel
        id={pathname}
        heading="window.queryLocalFonts()"
        resource={lazy(() => (window as any).queryLocalFonts())}
      />
    </Stack>
  );
}
