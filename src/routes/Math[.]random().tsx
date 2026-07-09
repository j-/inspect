import { createFileRoute, useLocation } from '@tanstack/react-router';
import { ObjectViewerPanel } from '#/components/ObjectViewerPanel';
import { eager } from '#/resource';

export const Route = createFileRoute('/Math.random()')({
  component: RouteComponent,
});

function RouteComponent() {
  const { pathname } = useLocation();

  return (
    <ObjectViewerPanel
      id={pathname}
      heading="Math.random()"
      // eslint-disable-next-line react-hooks/purity -- intentionally calling an impure function by design
      resource={eager(() => Math.random())}
    />
  );
}
