import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import { createFileRoute } from '@tanstack/react-router';
import { useEffect, useState } from 'react';
import { Viewer } from '#/viewer/Viewer';

export const Route = createFileRoute('/')({
  component: App,
  notFoundComponent: () => <div>Not found</div>,
});

function App() {
  const [data, setData] = useState<unknown>(null);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setData({
      sample: [
        true,
        null,
        42,
        'Hello, world!',
        undefined,
        [1, 'nested', false, [null]],
      ],
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
    });
  }, []);

  return (
    <main className="page-wrap px-4 pb-8 pt-14">
      <Paper sx={{ p: 2 }}>
        <Box>
          <Viewer object={data} />
        </Box>
      </Paper>
    </main>
  );
}
