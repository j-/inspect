import { createFileRoute, useLocation, useRouter } from '@tanstack/react-router';
import { ObjectViewerPanel } from '#/components/ObjectViewerPanel';

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
      initialValue={() => router}
      defaultIsExpanded={(_, thisPath) => thisPath.length < 3}
    />
  );
}
