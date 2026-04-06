import { createFileRoute, useLocation } from '@tanstack/react-router';
import { ObjectViewerPanel } from '#/components/ObjectViewerPanel';

export const Route = createFileRoute('/navigator.mediaDevices')({
  component: RouteComponent,
});

function RouteComponent() {
  const { pathname } = useLocation();

  return (
    <ObjectViewerPanel
      id={pathname}
      heading="navigator.mediaDevices"
      name="navigator.mediaDevices"
      initialValue={() => navigator.mediaDevices}
      actions={[
        {
          buttonProps: {
            children: 'navigator.mediaDevices.getUserMedia()',
          },
          initialData: () => (
            navigator.mediaDevices.getUserMedia()
          ),
        },
        {
          buttonProps: {
            children: 'navigator.mediaDevices.getUserMedia({ audio: true })',
          },
          initialData: () => (
            navigator.mediaDevices.getUserMedia({ audio: true })
          ),
        },
        {
          buttonProps: {
            children: 'navigator.mediaDevices.getUserMedia({ video: true })',
          },
          initialData: () => (
            navigator.mediaDevices.getUserMedia({ video: true })
          ),
        },
        {
          buttonProps: {
            children: 'navigator.mediaDevices.getUserMedia({ audio: true, video: true })',
          },
          initialData: () => (
            navigator.mediaDevices.getUserMedia({ audio: true, video: true })
          ),
        },
      ]}
    />
  );
}
