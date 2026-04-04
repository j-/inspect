import { createFileRoute } from '@tanstack/react-router';
import { ObjectViewerPanel } from '#/components/ObjectViewerPanel';

export const Route = createFileRoute('/navigator.keyboard')({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <ObjectViewerPanel
      initialValue={() => navigator.keyboard}
    />
  );
}
