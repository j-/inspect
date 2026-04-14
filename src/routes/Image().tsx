import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { createFileRoute, useLocation } from '@tanstack/react-router';
import { ObjectViewerPanel } from '#/components/ObjectViewerPanel';

export const Route = createFileRoute('/Image()')({
  component: RouteComponent,
});

function RouteComponent() {
  const { pathname } = useLocation();

  return (
    <Stack gap={4}>
      <Paper sx={{ p: 2 }}>
        <Typography>
          Constructs an <code>Image</code> object with width and height of 100. Sets the{' '}
          <code><a href="#result.src">src</a></code> to a 1px by 1px white dot PNG data URL. On first evaluation this
          will have a <code><a href="#result.complete">complete</a></code> property of <code>false</code>, and the{' '}
          <code><a href="#result.naturalWidth">naturalWidth</a></code> and{' '}
          <code><a href="#result.naturalHeight">naturalHeight</a></code> properties will be <code>0</code>.
        </Typography>
      </Paper>

      <ObjectViewerPanel
        id={pathname}
        heading="Image()"
        initialValue={() => {
          const img = new Image(100, 100);
          img.src = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8Xw8AAn8B9pXrHAAAAABJRU5ErkJggg==';
          return img;
        }}
      />
    </Stack>
  );
}
