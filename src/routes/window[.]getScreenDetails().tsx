import Stack from '@mui/material/Stack';
import { createFileRoute, useLocation } from '@tanstack/react-router';
import { ObjectViewerPanel } from '#/components/ObjectViewerPanel';
import { PermissionPanel } from '#/components/PermissionPanel';
import { lazyReactive } from '#/resource';

export const Route = createFileRoute('/window.getScreenDetails()')({
  component: RouteComponent,
});

function RouteComponent() {
  const { pathname } = useLocation();

  return (
    <Stack gap={4}>
      <PermissionPanel id={pathname + '#window-management'} name="window-management" />

      <ObjectViewerPanel
        id={pathname}
        heading="window.getScreenDetails()"
        resource={lazyReactive(
          () => (window as any).getScreenDetails(),
          'screenschange',
          'currentscreenchange',
        )}
      />
    </Stack>
  );
}
