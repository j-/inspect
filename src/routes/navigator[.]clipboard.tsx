import Stack from '@mui/material/Stack';
import { createFileRoute, useLocation } from '@tanstack/react-router';
import { ObjectViewerPanel } from '#/components/ObjectViewerPanel';

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
        initialValue={() => (
          navigator.permissions.query({
            name: 'clipboard-read' as PermissionName,
          })
        )}
      />

      <ObjectViewerPanel
        id={pathname}
        heading="navigator.clipboard"
        name="navigator.clipboard"
        initialValue={() => navigator.clipboard}
        actions={[
          {
            buttonProps: {
              children: 'navigator.clipboard.read()',
            },
            initialData: () => (
              navigator.clipboard.read()
            ),
          },
          {
            buttonProps: {
              children: 'navigator.clipboard.readText()',
            },
            initialData: () => (
              navigator.clipboard.readText()
            ),
          },
        ]}
      />
    </Stack>
  );
}
