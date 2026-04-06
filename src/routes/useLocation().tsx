import { createFileRoute, useLocation } from '@tanstack/react-router';
import { ObjectViewerPanel } from '#/components/ObjectViewerPanel';

export const Route = createFileRoute('/useLocation()')({
  component: RouteComponent,
});

function RouteComponent() {
  const location = useLocation();

  return (
    <ObjectViewerPanel
      id={location.pathname}
      heading="useLocation()"
      name="useLocation()"
      initialValue={() => location}
      defaultIsExpanded={(_, thisPath) => thisPath.length < 3}
    />
  );
}
