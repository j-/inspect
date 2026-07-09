import { createFileRoute, useLocation } from '@tanstack/react-router';
import { ObjectViewerPanel } from '#/components/ObjectViewerPanel';
import { lazyReactive } from '#/resource';

export const Route = createFileRoute('/window.getScreenDetails()')({
  component: RouteComponent,
});

function RouteComponent() {
  const { pathname } = useLocation();

  return (
    <ObjectViewerPanel
      id={pathname}
      heading="window.getScreenDetails()"
      resource={lazyReactive(
        () => (window as any).getScreenDetails(),
        'screenschange',
        'currentscreenchange',
      )}
    />
  );
}
