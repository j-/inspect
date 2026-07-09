import { createFileRoute, useLocation } from '@tanstack/react-router';
import { ObjectViewerPanel } from '#/components/ObjectViewerPanel';
import { reactive } from '#/resource';

export const Route = createFileRoute('/navigator.getBattery()')({
  component: RouteComponent,
});

function RouteComponent() {
  const { pathname } = useLocation();

  return (
    <ObjectViewerPanel
      id={pathname}
      heading="navigator.getBattery()"
      resource={reactive(
        () => (navigator as any).getBattery(),
        'chargingchange',
        'levelchange',
        'chargingtimechange',
        'dischargingtimechange',
      )}
    />
  );
}
