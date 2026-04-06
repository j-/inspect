import { createFileRoute, useLocation } from '@tanstack/react-router';
import { ObjectViewerPanel } from '#/components/ObjectViewerPanel';

export const Route = createFileRoute('/document')({
  component: RouteComponent,
});

function RouteComponent() {
  const { pathname } = useLocation();

  return (
    <ObjectViewerPanel
      id={pathname}
      heading="document"
      name="document"
      initialValue={() => document}
      defaultIsExpanded={(_, thisPath) => thisPath.length < 5}
    />
  );
}
