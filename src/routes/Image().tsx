import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { createFileRoute, useLocation } from '@tanstack/react-router';
import { useEffect, useState } from 'react';
import { ObjectViewerPanel } from '#/components/ObjectViewerPanel';
import { eager } from '#/resource';

export const Route = createFileRoute('/Image()')({
  component: RouteComponent,
});

function RouteComponent() {
  const [uploadedSrc, setUploadedSrc] = useState<string | null>(null);
  const { pathname } = useLocation();

  useEffect(() => {
    const handleDragover = (e: DragEvent) => {
      e.preventDefault();
    };

    const handleDrop = (e: DragEvent) => {
      e.preventDefault();

      const file = Array.from(e.dataTransfer?.files ?? [])
        .find((file) => file.type.startsWith('image/'));

      if (!file) return;

      const url = URL.createObjectURL(file);
      setUploadedSrc(url);
    };

    const handlePaste = (e: ClipboardEvent) => {
      e.preventDefault();

      const file = Array.from(e.clipboardData?.files ?? [])
        .find((file) => file.type.startsWith('image/'));

      if (!file) {
        const plain = e.clipboardData?.getData('text/plain');
        if (plain) setUploadedSrc(plain);

        return;
      }

      const url = URL.createObjectURL(file);
      setUploadedSrc(url);
    };

    window.addEventListener('dragover', handleDragover);
    window.addEventListener('drop', handleDrop);
    window.addEventListener('paste', handlePaste);

    return () => {
      window.removeEventListener('dragover', handleDragover);
      window.removeEventListener('drop', handleDrop);
      window.removeEventListener('paste', handlePaste);
    };
  }, []);

  return (
    <Stack gap={4}>
      <Paper sx={{ p: 2 }}>
        <Typography mb={2}>
          Constructs an <code>Image</code> object with width and height of 100. Sets the{' '}
          <code><a href="#result.src">src</a></code> to a 1px by 1px white dot PNG data URL. On first evaluation this
          will have a <code><a href="#result.complete">complete</a></code> property of <code>false</code>, and the{' '}
          <code><a href="#result.naturalWidth">naturalWidth</a></code> and{' '}
          <code><a href="#result.naturalHeight">naturalHeight</a></code> properties will be <code>0</code>.
        </Typography>

        <Typography mb={2}>
          Only showing keys not already in <code>HTMLElement.prototype</code>.
        </Typography>

        <Typography>
          Copy+paste or drag+drop an image file onto this page to see its properties as well.
        </Typography>
      </Paper>

      <ObjectViewerPanel
        id={pathname}
        heading="Image()"
        resource={eager(() => {
          const img = new Image(100, 100);
          img.src = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8Xw8AAn8B9pXrHAAAAABJRU5ErkJggg==';
          return img;
        })}
        filterKeys={(_thisObject, _fullPath, key) => !(key in HTMLElement.prototype)}
      />

      {uploadedSrc ? (
        <ObjectViewerPanel
          id={pathname + '#uploaded'}
          heading="Uploaded image"
          resource={eager(() => {
            const img = new Image(0, 0);
            img.src = uploadedSrc;
            return img;
          })}
          filterKeys={(_thisObject, _fullPath, key) => !(key in HTMLElement.prototype)}
        />
      ) : null}
    </Stack>
  );
}
