import { createFileRoute, useLocation } from '@tanstack/react-router';
import { ObjectViewerPanel } from '#/components/ObjectViewerPanel';
import { eager } from '#/resource';

export const Route = createFileRoute('/navigator.wakeLock')({
  component: RouteComponent,
});

function RouteComponent() {
  const { pathname } = useLocation();

  return (
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
          initialData: () => navigator.wakeLock.request(),
        },
        {
          buttonProps: {
            children: <code>navigator.wakeLock.request('screen')</code>,
          },
          initialData: () => navigator.wakeLock.request('screen'),
        },
        {
          buttonProps: {
            children: <code>navigator.wakeLock.request('foobar')</code>,
          },
          // @ts-expect-error Only accepts "screen"
          initialData: () => navigator.wakeLock.request('foobar'),
        },
      ]}
    />
  );
}
