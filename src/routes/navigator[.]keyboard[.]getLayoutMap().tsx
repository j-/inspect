import Stack from '@mui/material/Stack';
import { createFileRoute, useLocation } from '@tanstack/react-router';
import { createIsomorphicFn } from '@tanstack/react-start';
import { useEffect, useMemo, useState } from 'react';
import { ObjectViewerPanel } from '#/components/ObjectViewerPanel';
import { eager } from '#/resource';

export const Route = createFileRoute('/navigator.keyboard.getLayoutMap()')({
  component: RouteComponent,
});

const initLayoutMap = createIsomorphicFn()
  .client(() => navigator.keyboard.getLayoutMap())
  .server(() => null);

function RouteComponent() {
  const { pathname } = useLocation();

  const promise = useMemo(() => {
    return initLayoutMap();
  }, []);

  const [entries, setEntries] = useState<[KeyMapCode, string][] | null>(null);

  useEffect(() => {
    let isMounted = true;

    promise?.then((layoutMap: Map<KeyMapCode, string>) => {
      if (!isMounted) return;

      setEntries(Array.from(layoutMap.entries()));
    });

    return () => {
      isMounted = false;
    };
  }, [promise]);

  return (
    <Stack gap={4}>
      <ObjectViewerPanel
        id={pathname + '#layoutMap'}
        heading="navigator.keyboard.getLayoutMap()"
        resource={eager(() => promise)}
      />

      {entries && (
        <ObjectViewerPanel
          id={pathname + '#layoutMapEntries'}
          heading="Layout Map Entries"
          resource={eager(() => entries)}
        />
      )}
    </Stack>
  );
}
