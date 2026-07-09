import { createFileRoute, useLocation } from '@tanstack/react-router';
import { ObjectViewerPanel } from '#/components/ObjectViewerPanel';
import { eager } from '#/resource';

export const Route = createFileRoute(
  '/navigator.mediaDevices.getSupportedConstraints()',
)({
  component: RouteComponent,
});

function RouteComponent() {
  const { pathname } = useLocation();

  return (
    <ObjectViewerPanel
      id={pathname}
      heading="navigator.mediaDevices.getSupportedConstraints()"
      resource={eager(() => navigator.mediaDevices.getSupportedConstraints())}
    />
  );
}
