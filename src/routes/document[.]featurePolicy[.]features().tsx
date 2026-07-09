import { createFileRoute, useLocation } from '@tanstack/react-router';
import { ObjectViewerPanel } from '#/components/ObjectViewerPanel';
import { eager } from '#/resource';

export const Route = createFileRoute('/document.featurePolicy.features()')({
  component: RouteComponent,
});

function RouteComponent() {
  const { pathname } = useLocation();

  return (
    <ObjectViewerPanel
      id={pathname}
      heading="document.featurePolicy.features()"
      name="document.featurePolicy.features()"
      resource={eager(() => document.featurePolicy!.features())}
    />
  );
}
