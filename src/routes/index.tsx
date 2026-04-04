import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import { createFileRoute } from '@tanstack/react-router';
import type { FC } from 'react';
import { MenuConnected } from '#/components/MenuConnected';
import { ObjectViewerPanel } from '#/components/ObjectViewerPanel';

const App: FC = () => {
  return (
    <Stack gap={4}>
      <Paper sx={{ p: 2 }}>
        <MenuConnected />
      </Paper>

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

      <ObjectViewerPanel initialValue={() => {
        throw new Error('This example error is thrown immediately when the component renders');
      }} />
    </Stack>
  );
};

export const Route = createFileRoute('/')({
  component: App,
  notFoundComponent: () => <div>Not found</div>,
});
