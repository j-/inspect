import Stack from '@mui/material/Stack';
import { createFileRoute, useLocation } from '@tanstack/react-router';
import { ObjectViewerPanel } from '#/components/ObjectViewerPanel';
import { PermissionPanel } from '#/components/PermissionPanel';
import { eager } from '#/resource';

export const Route = createFileRoute('/navigator.clipboard')({
  component: RouteComponent,
});

function RouteComponent() {
  const { pathname } = useLocation();

  return (
    <Stack gap={4}>
      <PermissionPanel id={pathname + '#queryPermission'} name="clipboard-read" />
      <PermissionPanel id={pathname + '#clipboard-write'} name="clipboard-write" />

      <ObjectViewerPanel
        id={pathname}
        heading="navigator.clipboard"
        name="navigator.clipboard"
        resource={eager(() => navigator.clipboard)}
        actions={[
          {
            buttonProps: {
              children: 'navigator.clipboard.read()',
            },
            resource: () => eager(() => (
              navigator.clipboard.read()
            )),
          },
          {
            buttonProps: {
              children: 'navigator.clipboard.readText()',
            },
            resource: () => eager(() => (
              navigator.clipboard.readText()
            )),
          },
        ]}
      />
    </Stack>
  );
}
