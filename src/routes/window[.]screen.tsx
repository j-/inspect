import { createFileRoute } from '@tanstack/react-router';
import { ObjectViewerPanel } from '#/components/ObjectViewerPanel';

export const Route = createFileRoute('/window.screen')({
  component: RouteComponent,
});

function RouteComponent() {
  return <ObjectViewerPanel initialValue={() => window.screen} />;
}
