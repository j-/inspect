import { createFileRoute } from '@tanstack/react-router';
import { ObjectViewerPanel } from '#/components/ObjectViewerPanel';

export const Route = createFileRoute('/document.featurePolicy.features()')({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <ObjectViewerPanel
      heading="document.featurePolicy.features()"
      initialValue={() => document.featurePolicy.features()}
    />
  );
}
