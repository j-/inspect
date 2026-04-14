import { createFileRoute, useLocation } from '@tanstack/react-router';
import { ObjectViewerPanel } from '#/components/ObjectViewerPanel';

export const Route = createFileRoute('/window')({
  component: RouteComponent,
});

function RouteComponent() {
  const { pathname } = useLocation();

  return (
    <ObjectViewerPanel
      id={pathname}
      heading="window"
      name="window"
      initialValue={() => window}
      defaultIsExpanded={(thisObject, thisPath) => (
        !String(thisPath.at(-1)?.key).startsWith('__') &&
        thisObject !== document &&
        thisObject !== navigator &&
        thisObject instanceof Storage === false &&
        thisPath.length < 5
      )}
    />
  );
}
