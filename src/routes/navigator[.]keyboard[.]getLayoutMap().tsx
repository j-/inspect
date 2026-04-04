import Stack from '@mui/material/Stack';
import { createFileRoute } from '@tanstack/react-router';
import { useEffect, useMemo, useState } from 'react';
import { ObjectViewerPanel } from '#/components/ObjectViewerPanel';

export const Route = createFileRoute('/navigator.keyboard.getLayoutMap()')({
  component: RouteComponent,
});

function RouteComponent() {
  const promise = useMemo(() => {
    return navigator.keyboard.getLayoutMap();
  }, []);

  const [entries, setEntries] = useState<[KeyMapCode, string][] | null>(null);

  useEffect(() => {
    let isMounted = true;

    promise.then((layoutMap: Map<KeyMapCode, string>) => {
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
        initialValue={() => promise}
      />

      {entries && (
        <ObjectViewerPanel
          initialValue={() => entries}
        />
      )}
    </Stack>
  );
}
