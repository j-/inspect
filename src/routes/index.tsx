import Stack from '@mui/material/Stack';
import { ClientOnly, createFileRoute } from '@tanstack/react-router';
import type { FC } from 'react';
import { ObjectViewerPanel } from '#/components/ObjectViewerPanel';

const PanelWindowScreen: FC = () => (
  <ObjectViewerPanel initialValue={() => window.screen} />
);

const PanelWindowGetScreenDetails: FC = () => (
  <ObjectViewerPanel initialValue={() => (window as any).getScreenDetails()} />
);

const PanelSampleData: FC = () => (
  <ObjectViewerPanel
    initialValue={() => ({
      sample: [
        true,
        null,
        42,
        'Hello, world!',
        undefined,
        [1, 'nested', false, [null]],
      ],
      map: new Map<string, string | number>([
        ['key1', 'value1'],
        ['key2', 42],
      ]),
      set: new Set(['value1', 42]),
      nested: {
        a: 1,
        b: 'string',
        c: {
          d: 'deeply nested',
        },
      },
      async: {
        wait1sResolve: (async () => {
          await new Promise((resolve) => setTimeout(resolve, 1000));
          return 'resolved after 1 second';
        })(),
        wait2sReject: (async () => {
          await new Promise((_, reject) => setTimeout(reject, 2000, new Error('rejected after 2 seconds')));
        })(),
        wait3sResolve: (async () => {
          await new Promise((resolve) => setTimeout(resolve, 3000));
          return 'resolved after 3 seconds';
        })(),
      },
    })}
  />
);

const App: FC = () => {
  return (
    <main className="page-wrap px-4 pb-8 pt-14">
      <Stack gap={4}>
        <ClientOnly>
          <PanelWindowScreen />
        </ClientOnly>

        <ClientOnly>
          <PanelWindowGetScreenDetails />
        </ClientOnly>

        <ClientOnly>
          <PanelSampleData />
        </ClientOnly>
      </Stack>
    </main>
  );
};

export const Route = createFileRoute('/')({
  component: App,
  notFoundComponent: () => <div>Not found</div>,
});
