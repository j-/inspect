import { createFileRoute, useRouterState } from '@tanstack/react-router';
import { ObjectViewerPanel } from '#/components/ObjectViewerPanel';

export const Route = createFileRoute('/navigator.getBattery()')({
  component: RouteComponent,
});

function RouteComponent() {
  const pathname = useRouterState().location.pathname;

  return (
    <ObjectViewerPanel
      id={pathname}
      heading="navigator.getBattery()"
      initialValue={() => (navigator as any).getBattery()}
    />
  );
}
