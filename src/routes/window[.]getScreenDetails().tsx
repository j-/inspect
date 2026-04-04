import { createFileRoute } from '@tanstack/react-router';
import { ObjectViewerPanel } from '#/components/ObjectViewerPanel';

export const Route = createFileRoute('/window.getScreenDetails()')({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <ObjectViewerPanel
      heading="window.getScreenDetails()"
      initialValue={() => (window as any).getScreenDetails()}
    />
  );
}
