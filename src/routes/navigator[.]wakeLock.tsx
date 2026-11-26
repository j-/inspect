import Stack from '@mui/material/Stack';
import { createFileRoute, useLocation } from '@tanstack/react-router';
import { ObjectViewerPanel } from '#/components/ObjectViewerPanel';
import { PermissionPanel } from '#/components/PermissionPanel';
import { eager } from '#/resource';

export const Route = createFileRoute('/navigator.wakeLock')({
  component: RouteComponent,
});

function RouteComponent() {
  const { pathname } = useLocation();

  return (
    <Stack gap={4}>
      <PermissionPanel id={pathname + '#screen-wake-lock'} name="screen-wake-lock" />

      <ObjectViewerPanel
        id={pathname}
        heading="navigator.wakeLock"
        name="navigator.wakeLock"
        resource={eager(() => navigator.wakeLock)}
        actions={[
          {
            buttonProps: {
              children: <code>navigator.wakeLock.request()</code>,
            },
            resource: () => eager(() => navigator.wakeLock.request()),
          },
          {
            buttonProps: {
              children: <code>navigator.wakeLock.request('screen')</code>,
            },
            resource: () => eager(() => navigator.wakeLock.request('screen')),
          },
          {
            buttonProps: {
              children: <code>navigator.wakeLock.request('foobar')</code>,
            },
            // @ts-expect-error Only accepts "screen"
            resource: () => eager(() => navigator.wakeLock.request('foobar')),
          },
        ]}
      />
    </Stack>
  );
}
