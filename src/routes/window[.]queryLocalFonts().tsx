import Stack from '@mui/material/Stack';
import { createFileRoute, useLocation } from '@tanstack/react-router';
import { ObjectViewerPanel } from '#/components/ObjectViewerPanel';
import { PermissionPanel } from '#/components/PermissionPanel';
import { lazy } from '#/resource';

export const Route = createFileRoute('/window.queryLocalFonts()')({
  component: RouteComponent,
});

function RouteComponent() {
  const { pathname } = useLocation();

  return (
    <Stack gap={4}>
      <PermissionPanel id={pathname + '#queryPermission'} name="local-fonts" />

      <ObjectViewerPanel
        id={pathname}
        heading="window.queryLocalFonts()"
        resource={lazy(() => (window as any).queryLocalFonts())}
      />
    </Stack>
  );
}
