import { createFileRoute, useRouterState } from '@tanstack/react-router';
import { ObjectViewerPanel } from '#/components/ObjectViewerPanel';

export const Route = createFileRoute(
  '/document.featurePolicy.allowedFeatures()',
)({
  component: RouteComponent,
});

function RouteComponent() {
  const pathname = useRouterState().location.pathname;

  return (
    <ObjectViewerPanel
      id={pathname}
      heading="document.featurePolicy.allowedFeatures()"
      name="document.featurePolicy.allowedFeatures()"
      initialValue={() => document.featurePolicy!.allowedFeatures()}
    />
  );
}
