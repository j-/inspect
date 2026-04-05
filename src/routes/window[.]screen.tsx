import { createFileRoute, useRouterState } from '@tanstack/react-router';
import { ObjectViewerPanel } from '#/components/ObjectViewerPanel';

export const Route = createFileRoute('/window.screen')({
  component: RouteComponent,
});

function RouteComponent() {
  const pathname = useRouterState().location.pathname;

  return (
    <ObjectViewerPanel
      id={pathname}
      heading="window.screen"
      name="window.screen"
      initialValue={() => window.screen}
    />
  );
}
