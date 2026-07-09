import { createFileRoute, useLocation } from '@tanstack/react-router';
import { ObjectViewerPanel } from '#/components/ObjectViewerPanel';
import { onEvent } from '#/resource';

export const Route = createFileRoute(
  '/navigator.mediaDevices.enumerateDevices()',
)({
  component: RouteComponent,
});

function RouteComponent() {
  const { pathname } = useLocation();

  return (
    <ObjectViewerPanel
      id={pathname}
      heading="navigator.mediaDevices.enumerateDevices()"
      resource={onEvent(
        () => navigator.mediaDevices.enumerateDevices(),
        () => navigator.mediaDevices,
        'devicechange',
      )}
    />
  );
}
