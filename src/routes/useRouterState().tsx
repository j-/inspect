import { createFileRoute, useLocation, useRouterState } from '@tanstack/react-router';
import { ObjectViewerPanel } from '#/components/ObjectViewerPanel';

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
      initialValue={() => routerState}
    />
  );
}
