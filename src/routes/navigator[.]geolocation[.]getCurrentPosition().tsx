import { createFileRoute, useLocation } from '@tanstack/react-router';
import { ObjectViewerPanel } from '#/components/ObjectViewerPanel';
import { lazy } from '#/resource';

export const Route = createFileRoute(
  '/navigator.geolocation.getCurrentPosition()',
)({
  component: RouteComponent,
});

function RouteComponent() {
  const { pathname } = useLocation();

  return (
    <ObjectViewerPanel
      id={pathname}
      heading="navigator.geolocation.getCurrentPosition(resolve)"
      resource={lazy(() => {
        return new Promise((resolve, reject) => {
          navigator.geolocation.getCurrentPosition(resolve, reject);
        });
      })}
    />
  );
}
