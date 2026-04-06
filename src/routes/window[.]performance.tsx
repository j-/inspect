import { createFileRoute, useLocation } from '@tanstack/react-router';
import { ObjectViewerPanel } from '#/components/ObjectViewerPanel';

export const Route = createFileRoute('/window.performance')({
  component: RouteComponent,
});

function RouteComponent() {
  const { pathname } = useLocation();

  return (
    <ObjectViewerPanel
      id={pathname}
      heading="window.performance"
      name="window.performance"
      initialValue={() => window.performance}
    />
  );
}
