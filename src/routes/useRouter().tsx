import { createFileRoute, useLocation, useRouter } from '@tanstack/react-router';
import { ObjectViewerPanel } from '#/components/ObjectViewerPanel';
import { eager } from '#/resource';

export const Route = createFileRoute('/useRouter()')({
  component: RouteComponent,
});

function RouteComponent() {
  const router = useRouter();
  const { pathname } = useLocation();

  return (
    <ObjectViewerPanel
      id={pathname}
      heading="useRouter()"
      name="useRouter()"
      resource={eager(() => router)}
      defaultIsExpanded={(_, thisPath) => thisPath.length < 3}
    />
  );
}
