import { createFileRoute, useLocation } from '@tanstack/react-router';
import { ObjectViewerPanel } from '#/components/ObjectViewerPanel';
import { lazy } from '#/resource';

export const Route = createFileRoute('/window.showOpenFilePicker()')({
  component: RouteComponent,
});

function RouteComponent() {
  const { pathname } = useLocation();

  return (
    <ObjectViewerPanel
      id={pathname}
      heading="window.showOpenFilePicker()"
      resource={lazy(() => window.showOpenFilePicker())}
    />
  );
}
