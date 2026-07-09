import { createFileRoute, useLocation } from '@tanstack/react-router';
import { ObjectViewerPanel } from '#/components/ObjectViewerPanel';
import { polling } from '#/resource';

export const Route = createFileRoute('/navigator.userActivation')({
  component: RouteComponent,
});

function RouteComponent() {
  const { pathname } = useLocation();

  return (
    <ObjectViewerPanel
      id={pathname}
      heading="navigator.userActivation"
      name="navigator.userActivation"
      resource={polling(() => navigator.userActivation, 100)}
    />
  );
}
