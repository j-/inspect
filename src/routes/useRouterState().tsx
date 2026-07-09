import { createFileRoute, useLocation, useRouterState } from '@tanstack/react-router';
import { ObjectViewerPanel } from '#/components/ObjectViewerPanel';
import { eager } from '#/resource';

export const Route = createFileRoute('/useRouterState()')({
  component: RouteComponent,
});

function RouteComponent() {
  const routerState = useRouterState();
  const { pathname } = useLocation();

  return (
    <ObjectViewerPanel
      id={pathname}
      heading="useRouterState()"
      name="useRouterState()"
      resource={eager(() => routerState)}
    />
  );
}
