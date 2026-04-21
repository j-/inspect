import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { createFileRoute, useLocation } from '@tanstack/react-router';
import { useEffect, useState } from 'react';
import { ObjectViewerPanel } from '#/components/ObjectViewerPanel';

export const Route = createFileRoute('/DataTransfer()')({
  component: RouteComponent,
});

function RouteComponent() {
  const [count, setCount] = useState(0);
  const [dataTransfer, setDataTransfer] = useState<DataTransfer | null>(null);
  const { pathname } = useLocation();

  useEffect(() => {
    const handleDragover = (e: DragEvent) => {
      e.preventDefault();
    };

    const handleDrop = (e: DragEvent) => {
      e.preventDefault();
      setDataTransfer(e.dataTransfer);
      setCount(e.timeStamp);
    };

    const handlePaste = (e: ClipboardEvent) => {
      e.preventDefault();
      setDataTransfer(e.clipboardData);
      setCount(e.timeStamp);
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
        <Typography>
          Copy+paste or drag+drop into this page to see the properties of the DataTransfer object.
        </Typography>
      </Paper>

      {dataTransfer ? (
        <ObjectViewerPanel
          key={count}
          id={pathname}
          heading="DataTransfer()"
          initialValue={() => dataTransfer}
        />
      ) : null}
    </Stack>
  );
}
