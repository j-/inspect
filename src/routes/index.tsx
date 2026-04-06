import Stack from '@mui/material/Stack';
import { createFileRoute } from '@tanstack/react-router';
import type { FC } from 'react';
import { ObjectViewerPanel } from '#/components/ObjectViewerPanel';

const App: FC = () => {
  return (
    <Stack gap={4}>
      <ObjectViewerPanel
        id="kitchen-sink"
        heading="Kitchen sink"
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
          mapEmpty: new Map(),
          set: new Set(['value1', 42]),
          setEmpty: new Set(),
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
          functionNamed: function namedFunction() {
            return 'I am a named function';
          },
          functionAnonymous: [() => 'I am an anonymous function'][0],
          symbol: Symbol('example'),
          NaN: NaN,
          Infinity: Infinity,
          regex: new RegExp('\\x68ttp\\x3a\\/\\/localhost\\x3a3000\\/', 'gi'),
          dateValid: new Date(),
          dateInvalid: new Date('invalid'),
        })}
      />

      <ObjectViewerPanel
        id="circular-reference"
        heading="Circular reference example"
        initialValue={() => {
          const a: Record<string, any> = {};
          const b: Record<string, any> = { a };
          a.b = b; // Create a circular reference

          return b;
        }}
      />

      <ObjectViewerPanel
        id="get-and-set"
        heading="Get and set example"
        initialValue={() => ({
          get value() {
            return 'This value is from a getter';
          },
          set value(newValue) {
            console.log('Setter called with:', newValue);
          },
        })}
      />

      <ObjectViewerPanel
        id="error-example"
        heading="Error example"
        initialValue={() => {
          throw new Error('This example error is thrown immediately when the component renders');
        }}
      />
    </Stack>
  );
};

export const Route = createFileRoute('/')({
  component: App,
  notFoundComponent: () => <div>Not found</div>,
});
