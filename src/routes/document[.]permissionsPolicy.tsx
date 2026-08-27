import { createFileRoute, useLocation } from '@tanstack/react-router';
import { ObjectViewerPanel } from '#/components/ObjectViewerPanel';
import { eager } from '#/resource';

export const Route = createFileRoute('/document.permissionsPolicy')({
  component: RouteComponent,
});

function RouteComponent() {
  const { pathname } = useLocation();

  return (
    <ObjectViewerPanel
      id={pathname}
      heading="document.permissionsPolicy"
      name="document.permissionsPolicy"
      resource={eager(() => document.permissionsPolicy)}
    />
  );
}
