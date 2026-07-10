import Stack from '@mui/material/Stack';
import { createFileRoute, useLocation } from '@tanstack/react-router';
import { ObjectViewerPanel } from '#/components/ObjectViewerPanel';
import { eager } from '#/resource';

export const Route = createFileRoute('/navigator.keyboard.getLayoutMap()')({
  component: RouteComponent,
});

function RouteComponent() {
  const { pathname } = useLocation();

  return (
    <Stack gap={4}>
      <ObjectViewerPanel
        id={pathname + '#layoutMap'}
        heading="navigator.keyboard.getLayoutMap()"
        resource={eager(() => navigator.keyboard.getLayoutMap())}
      />

      <ObjectViewerPanel
        id={pathname + '#layoutMapEntries'}
        heading="Layout Map Entries"
        resource={eager(async () => {
          const layoutMap = await navigator.keyboard.getLayoutMap();
          return Array.from(layoutMap.entries());
        })}
      />
    </Stack>
  );
}
