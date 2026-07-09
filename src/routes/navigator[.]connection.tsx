import { createFileRoute, useLocation } from '@tanstack/react-router';
import { ObjectViewerPanel } from '#/components/ObjectViewerPanel';
import { reactive } from '#/resource';

export const Route = createFileRoute('/navigator.connection')({
  component: RouteComponent,
});

function RouteComponent() {
  const { pathname } = useLocation();

  return (
    <ObjectViewerPanel
      id={pathname}
      heading="navigator.connection"
      name="navigator.connection"
      resource={reactive(() => navigator.connection, 'change')}
    />
  );
}
