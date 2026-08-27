import { createFileRoute, useLocation } from '@tanstack/react-router';
import { ObjectViewerPanel } from '#/components/ObjectViewerPanel';
import { eager } from '#/resource';

export const Route = createFileRoute(
  '/document.permissionsPolicy.features()',
)({
  component: RouteComponent,
});

function RouteComponent() {
  const { pathname } = useLocation();

  return (
    <ObjectViewerPanel
      id={pathname}
      heading="document.permissionsPolicy.features()"
      name="document.permissionsPolicy.features()"
      resource={eager(() => document.permissionsPolicy!.features())}
    />
  );
}
