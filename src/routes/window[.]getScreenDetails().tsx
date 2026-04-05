import { createFileRoute, useRouterState } from '@tanstack/react-router';
import { ObjectViewerPanel } from '#/components/ObjectViewerPanel';

export const Route = createFileRoute('/window.getScreenDetails()')({
  component: RouteComponent,
});

function RouteComponent() {
  const pathname = useRouterState().location.pathname;

  return (
    <ObjectViewerPanel
      id={pathname}
      heading="window.getScreenDetails()"
      initialValue={() => (window as any).getScreenDetails()}
    />
  );
}
