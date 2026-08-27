import { createFileRoute, useLocation } from '@tanstack/react-router';
import { ObjectViewerPanel } from '#/components/ObjectViewerPanel';
import { eager } from '#/resource';

export const Route = createFileRoute(
  '/document.permissionsPolicy.allowedFeatures()',
)({
  component: RouteComponent,
});

function RouteComponent() {
  const { pathname } = useLocation();

  return (
    <ObjectViewerPanel
      id={pathname}
      heading="document.permissionsPolicy.allowedFeatures()"
      name="document.permissionsPolicy.allowedFeatures()"
      resource={eager(() => document.permissionsPolicy!.allowedFeatures())}
    />
  );
}
