import { createFileRoute, useRouterState } from '@tanstack/react-router';
import { ObjectViewerPanel } from '#/components/ObjectViewerPanel';

export const Route = createFileRoute('/document.featurePolicy.features()')({
  component: RouteComponent,
});

function RouteComponent() {
  const pathname = useRouterState().location.pathname;

  return (
    <ObjectViewerPanel
      id={pathname}
      heading="document.featurePolicy.features()"
      name="document.featurePolicy.features()"
      initialValue={() => document.featurePolicy!.features()}
    />
  );
}
