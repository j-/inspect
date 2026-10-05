import { createFileRoute, useLocation } from '@tanstack/react-router';
import { ObjectViewerPanel } from '#/components/ObjectViewerPanel';
import { eager } from '#/resource';

export const Route = createFileRoute('/dns.json')({
  component: RouteComponent,
});

const fetcher = async () => {
  const res = await fetch('https://data.iana.org/rdap/dns.json');
  return res.json();
};

function RouteComponent() {
  const { pathname } = useLocation();

  return (
    <ObjectViewerPanel
      id={pathname}
      heading="dns.json"
      name="res"
      resource={eager(fetcher)}
    />
  );
}
