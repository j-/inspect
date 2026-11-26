import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { createFileRoute, useLocation } from '@tanstack/react-router';
import { useEffect, useState, type FC } from 'react';
import { PermissionPanel } from '#/components/PermissionPanel';
import { knownPermissionNames, queryPermission } from '#/permissions';

const discoverPermissionNames = async (): Promise<string[]> => {
  if (typeof navigator.permissions?.query !== 'function') return [];

  const names = [...new Set([
    ...knownPermissionNames,
    ...document.featurePolicy?.features?.() ?? [],
    ...document.permissionsPolicy?.features?.() ?? [],
  ])].sort();

  const results = await Promise.allSettled(names.map(queryPermission));
  return names.filter((_, index) => results[index].status === 'fulfilled');
};

const RouteComponent: FC = () => {
  const { pathname } = useLocation();
  const [names, setNames] = useState<string[] | null>(null);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    let cancelled = false;
    void discoverPermissionNames().then(
      (names) => {
        if (!cancelled) setNames(names);
      },
      () => {
        if (!cancelled) setFailed(true);
      },
    );
    return () => {
      cancelled = true;
    };
  }, []);

  if (failed) return <Typography role="status">Could not discover permissions.</Typography>;
  if (names === null) return <Typography role="status">Checking permissions…</Typography>;
  if (names.length === 0) return <Typography role="status">No queryable permissions found.</Typography>;

  return (
    <Stack gap={4}>
      {names.map((name) => (
        <PermissionPanel key={name} id={`${pathname}#${name}`} name={name} />
      ))}
    </Stack>
  );
};

export const Route = createFileRoute('/navigator.permissions')({
  component: RouteComponent,
});
