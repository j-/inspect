import { createFileRoute, useLocation } from '@tanstack/react-router';
import { ObjectViewerPanel } from '#/components/ObjectViewerPanel';

export const Route = createFileRoute('/navigator.clipboard')({
  component: RouteComponent,
});

function RouteComponent() {
  const { pathname } = useLocation();

  return (
    <ObjectViewerPanel
      id={pathname}
      heading="navigator.clipboard"
      name="navigator.clipboard"
      initialValue={() => navigator.clipboard}
      actions={[
        {
          buttonProps: {
            children: 'navigator.clipboard.read()',
          },
          initialData: () => (
            navigator.clipboard.read()
          ),
        },
        {
          buttonProps: {
            children: 'navigator.clipboard.readText()',
          },
          initialData: () => (
            navigator.clipboard.readText()
          ),
        },
      ]}
    />
  );
}
