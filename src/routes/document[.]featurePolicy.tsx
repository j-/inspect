import { createFileRoute } from '@tanstack/react-router';
import { ObjectViewerPanel } from '#/components/ObjectViewerPanel';

export const Route = createFileRoute('/document.featurePolicy')({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <ObjectViewerPanel
      heading="document.featurePolicy"
      initialValue={() => document.featurePolicy}
    />
  );
}
