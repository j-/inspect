import { createFileRoute } from '@tanstack/react-router';
import { ObjectViewerPanel } from '#/components/ObjectViewerPanel';

export const Route = createFileRoute(
  '/document.featurePolicy.allowedFeatures()',
)({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <ObjectViewerPanel
      heading="document.featurePolicy.allowedFeatures()"
      initialValue={() => document.featurePolicy.allowedFeatures()}
    />
  );
}
