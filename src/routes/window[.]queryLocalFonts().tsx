import { createFileRoute, useLocation } from '@tanstack/react-router';
import { ObjectViewerPanel } from '#/components/ObjectViewerPanel';
import { lazy } from '#/resource';

export const Route = createFileRoute('/window.queryLocalFonts()')({
  component: RouteComponent,
});

function RouteComponent() {
  const { pathname } = useLocation();

  return (
    <ObjectViewerPanel
      id={pathname}
      heading="window.queryLocalFonts()"
      resource={lazy(() => (window as any).queryLocalFonts())}
    />
  );
}
