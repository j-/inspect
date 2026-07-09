import Stack from '@mui/material/Stack';
import { createFileRoute, useLocation } from '@tanstack/react-router';
import { createIsomorphicFn } from '@tanstack/react-start';
import { ObjectViewerPanel } from '#/components/ObjectViewerPanel';
import { eager } from '#/resource';

export const Route = createFileRoute('/navigator.share()')({
  component: RouteComponent,
});

const getExampleFile = createIsomorphicFn().client(() => {
  const exampleFiles: File[] = [];

  try {
    exampleFiles.push(
      new File(['Example file content'], 'example.txt', { type: 'text/plain' }),
    );
  } catch (error) {
    console.warn('File API is not supported in this environment. Example files will be unavailable.', error);
  }

  return exampleFiles;
}).server(() => {
  // On the server, we can't create File objects, so we return an empty array or mock data if needed
  return [];
});

const getExampleFiles = createIsomorphicFn().client(() => {
  const exampleFiles: File[] = [];

  try {
    exampleFiles.push(
      new File(['Example file 1 content'], 'example1.txt', { type: 'text/plain' }),
    );
    exampleFiles.push(
      new File(['Example file 2 content'], 'example2.txt', { type: 'text/plain' }),
    );
  } catch (error) {
    console.warn('File API is not supported in this environment. Example files will be unavailable.', error);
  }

  return exampleFiles;
}).server(() => {
  // On the server, we can't create File objects, so we return an empty array or mock data if needed
  return [];
});

function RouteComponent() {
  const { pathname } = useLocation();

  return (
    <Stack gap={4}>
      <ObjectViewerPanel
        id={pathname + '#noData'}
        heading="No data"
        actions={[
          {
            buttonProps: {
              children: <code>navigator.canShare()</code>,
            },
            resource: () => eager(() => navigator.canShare()),
          },
          {
            buttonProps: {
              children: <code>navigator.share()</code>,
            },
            resource: () => eager(() => navigator.share()),
          },
        ]}
      />

      <ObjectViewerPanel
        id={pathname + '#titleOnly'}
        heading="Title only"
        actions={[
          {
            buttonProps: {
              children: <code>{'navigator.canShare({ title: \'Share data title\' })'}</code>,
            },
            resource: () => eager(() => (
              navigator.canShare({ title: 'Share data title' })
            )),
          },
          {
            buttonProps: {
              children: <code>{'navigator.share({ title: \'Share data title\' })'}</code>,
            },
            resource: () => eager(() => (
              navigator.share({ title: 'Share data title' })
            )),
          },
        ]}
      />

      <ObjectViewerPanel
        id={pathname + '#textOnly'}
        heading="Text only"
        actions={[
          {
            buttonProps: {
              children: <code>{'navigator.canShare({ text: \'Share data text\' })'}</code>,
            },
            resource: () => eager(() => (
              navigator.canShare({ text: 'Share data text' })
            )),
          },
          {
            buttonProps: {
              children: <code>{'navigator.share({ text: \'Share data text\' })'}</code>,
            },
            resource: () => eager(() => (
              navigator.share({ text: 'Share data text' })
            )),
          },
        ]}
      />

      <ObjectViewerPanel
        id={pathname + '#titleAndText'}
        heading="Title and text"
        actions={[
          {
            buttonProps: {
              children: <code>{'navigator.canShare({ title: \'Share data title\', text: \'Share data text\' })'}</code>,
            },
            resource: () => eager(() => (
              navigator.canShare({
                title: 'Share data title',
                text: 'Share data text',
              })
            )),
          },
          {
            buttonProps: {
              children: <code>{'navigator.share({ title: \'Share data title\', text: \'Share data text\' })'}</code>,
            },
            resource: () => eager(() => (
              navigator.share({
                title: 'Share data title',
                text: 'Share data text',
              })
            )),
          },
        ]}
      />

      <ObjectViewerPanel
        id={pathname + '#urlOnly'}
        heading="URL only"
        actions={[
          {
            buttonProps: {
              children: <code>{'navigator.canShare({ url: \'https://example.com\' })'}</code>,
            },
            resource: () => eager(() => (
              navigator.canShare({ url: 'https://example.com' })
            )),
          },
          {
            buttonProps: {
              children: <code>{'navigator.share({ url: \'https://example.com\' })'}</code>,
            },
            resource: () => eager(() => (
              navigator.share({ url: 'https://example.com' })
            )),
          },
        ]}
      />

      <ObjectViewerPanel
        id={pathname + '#urlAndTitle'}
        heading="URL and title"
        actions={[
          {
            buttonProps: {
              children: <code>{'navigator.canShare({ url: \'https://example.com\', title: \'Share data title\' })'}</code>,
            },
            resource: () => eager(() => (
              navigator.canShare({
                url: 'https://example.com',
                title: 'Share data title',
              })
            )),
          },
          {
            buttonProps: {
              children: <code>{'navigator.share({ url: \'https://example.com\', title: \'Share data title\' })'}</code>,
            },
            resource: () => eager(() => (
              navigator.share({
                url: 'https://example.com',
                title: 'Share data title',
              })
            )),
          },
        ]}
      />

      <ObjectViewerPanel
        id={pathname + '#urlAndText'}
        heading="URL and text"
        actions={[
          {
            buttonProps: {
              children: <code>{'navigator.canShare({ url: \'https://example.com\', text: \'Share data text\' })'}</code>,
            },
            resource: () => eager(() => (
              navigator.canShare({
                url: 'https://example.com',
                text: 'Share data text',
              })
            )),
          },
          {
            buttonProps: {
              children: <code>{'navigator.share({ url: \'https://example.com\', text: \'Share data text\' })'}</code>,
            },
            resource: () => eager(() => (
              navigator.share({
                url: 'https://example.com',
                text: 'Share data text',
              })
            )),
          },
        ]}
      />

      <ObjectViewerPanel
        id={pathname + '#urlTitleAndText'}
        heading="URL, title, and text"
        actions={[
          {
            buttonProps: {
              children: <code>{'navigator.canShare({ url: \'https://example.com\', title: \'Share data title\', text: \'Share data text\' })'}</code>,
            },
            resource: () => eager(() => (
              navigator.canShare({
                url: 'https://example.com',
                title: 'Share data title',
                text: 'Share data text',
              })
            )),
          },
          {
            buttonProps: {
              children: <code>{'navigator.share({ url: \'https://example.com\', title: \'Share data title\', text: \'Share data text\' })'}</code>,
            },
            resource: () => eager(() => (
              navigator.share({
                url: 'https://example.com',
                title: 'Share data title',
                text: 'Share data text',
              })
            )),
          },
        ]}
      />

      <ObjectViewerPanel
        id={pathname + '#file'}
        heading="One file"
        actions={[
          {
            buttonProps: {
              children: <code>{'navigator.canShare({ files: getExampleFile() })'}</code>,
            },
            resource: () => eager(() => (
              navigator.canShare({
                files: getExampleFile(),
              })
            )),
          },
          {
            buttonProps: {
              children: <code>{'navigator.share({ files: getExampleFile() })'}</code>,
            },
            resource: () => eager(() => (
              navigator.share({
                files: getExampleFile(),
              })
            )),
          },
        ]}
      />

      <ObjectViewerPanel
        id={pathname + '#files'}
        heading="Multiple files"
        actions={[
          {
            buttonProps: {
              children: <code>{'navigator.canShare({ files: getExampleFiles() })'}</code>,
            },
            resource: () => eager(() => (
              navigator.canShare({
                files: getExampleFiles(),
              })
            )),
          },
          {
            buttonProps: {
              children: <code>{'navigator.share({ files: getExampleFiles() })'}</code>,
            },
            resource: () => eager(() => (
              navigator.share({
                files: getExampleFiles(),
              })
            )),
          },
        ]}
      />

      <ObjectViewerPanel
        id={pathname + '#urlTitleTextAndFile'}
        heading="URL, title, text, and one file"
        actions={[
          {
            buttonProps: {
              children: <code>{'navigator.canShare({ url: \'https://example.com\', title: \'Share data title\', text: \'Share data text\', files: getExampleFile() })'}</code>,
            },
            resource: () => eager(() => (
              navigator.canShare({
                url: 'https://example.com',
                title: 'Share data title',
                text: 'Share data text',
                files: getExampleFile(),
              })
            )),
          },
          {
            buttonProps: {
              children: <code>{'navigator.share({ url: \'https://example.com\', title: \'Share data title\', text: \'Share data text\', files: getExampleFile() })'}</code>,
            },
            resource: () => eager(() => (
              navigator.share({
                url: 'https://example.com',
                title: 'Share data title',
                text: 'Share data text',
                files: getExampleFile(),
              })
            )),
          },
        ]}
      />

      <ObjectViewerPanel
        id={pathname + '#urlTitleTextAndFiles'}
        heading="URL, title, text, and multiple files"
        actions={[
          {
            buttonProps: {
              children: <code>{'navigator.canShare({ url: \'https://example.com\', title: \'Share data title\', text: \'Share data text\', files: getExampleFiles() })'}</code>,
            },
            resource: () => eager(() => (
              navigator.canShare({
                url: 'https://example.com',
                title: 'Share data title',
                text: 'Share data text',
                files: getExampleFiles(),
              })
            )),
          },
          {
            buttonProps: {
              children: <code>{'navigator.share({ url: \'https://example.com\', title: \'Share data title\', text: \'Share data text\', files: getExampleFiles() })'}</code>,
            },
            resource: () => eager(() => (
              navigator.share({
                url: 'https://example.com',
                title: 'Share data title',
                text: 'Share data text',
                files: getExampleFiles(),
              })
            )),
          },
        ]}
      />
    </Stack>
  );
}
