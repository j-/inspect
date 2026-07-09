import Stack from '@mui/material/Stack';
import { createFileRoute, useLocation } from '@tanstack/react-router';
import { ObjectViewerPanel } from '#/components/ObjectViewerPanel';
import { eager, reactive } from '#/resource';

export const Route = createFileRoute('/navigator.clipboard')({
  component: RouteComponent,
});

function RouteComponent() {
  const { pathname } = useLocation();

  return (
    <Stack gap={4}>
      <ObjectViewerPanel
        id={pathname + '#queryPermission'}
        heading="clipboard-read permission"
        resource={reactive(() => (
          navigator.permissions.query({
            name: 'clipboard-read' as PermissionName,
          })
        ), 'change')}
      />

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
