import { createFileRoute, useLocation } from '@tanstack/react-router';
import { ObjectViewerPanel } from '#/components/ObjectViewerPanel';
import { onEvent } from '#/resource';

export const Route = createFileRoute('/navigator.onLine')({
  component: RouteComponent,
});

function RouteComponent() {
  const { pathname } = useLocation();

  return (
    <ObjectViewerPanel
      id={pathname}
      heading="navigator.onLine"
      resource={onEvent(() => navigator.onLine, () => window, 'online', 'offline')}
    />
  );
}
