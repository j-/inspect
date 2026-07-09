import { createFileRoute, useLocation } from '@tanstack/react-router';
import { ObjectViewerPanel } from '#/components/ObjectViewerPanel';
import { eager } from '#/resource';

export const Route = createFileRoute(
  '/document.featurePolicy.allowedFeatures()',
)({
  component: RouteComponent,
});

function RouteComponent() {
  const { pathname } = useLocation();

  return (
    <ObjectViewerPanel
      id={pathname}
      heading="document.featurePolicy.allowedFeatures()"
      name="document.featurePolicy.allowedFeatures()"
      resource={eager(() => document.featurePolicy!.allowedFeatures())}
    />
  );
}
