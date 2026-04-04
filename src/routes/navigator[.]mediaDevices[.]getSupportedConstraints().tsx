import { createFileRoute } from '@tanstack/react-router';
import { ObjectViewerPanel } from '#/components/ObjectViewerPanel';

export const Route = createFileRoute(
  '/navigator.mediaDevices.getSupportedConstraints()',
)({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <ObjectViewerPanel
      heading="navigator.mediaDevices.getSupportedConstraints()"
      initialValue={() => navigator.mediaDevices.getSupportedConstraints()}
    />
  );
}
