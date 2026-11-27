import createCache from '@emotion/cache';
import { CacheProvider } from '@emotion/react';
import Box from '@mui/material/Box';
import CssBaseline from '@mui/material/CssBaseline';
import Stack from '@mui/material/Stack';
import { ThemeProvider } from '@mui/material/styles';
import type { PropsWithChildren } from 'react';
import { createRoot } from 'react-dom/client';
import type { ActionSectionProps } from './ActionSection';
import { ObjectViewerPanel } from './ObjectViewerPanel';
import { getPictureInPictureWindow } from '#/pictureInPicture';
import { eager, onEvent } from '#/resource';
import { codeTheme, theme } from '#/theme';
import { ObjectViewString } from '#/viewer/ObjectViewString';

function CodeHeading({ children }: PropsWithChildren) {
  return (
    <ThemeProvider theme={codeTheme}>
      <Box
        component="code"
        sx={{
          display: 'block',
          overflowX: 'auto',
          whiteSpace: 'pre',
          fontFamily: 'monospace',
          fontSize: (theme) => theme.typography.body1.fontSize,
          lineHeight: 1.5,
          '& .method': { color: 'secondary.dark' },
          '& .property': { color: 'primary.dark' },
        }}
      >
        {children}
      </Box>
    </ThemeProvider>
  );
}

export function PictureInPictureHeading({ children }: PropsWithChildren) {
  return (
    <CodeHeading>
      window.<span className="property">documentPictureInPicture</span>{children}
    </CodeHeading>
  );
}

const pictureInPictureDisplayModeQuery = '(display-mode: picture-in-picture)';

export function PictureInPictureDisplayModePanel({ id, targetWindow }: { id: string; targetWindow?: Window }) {
  const getMediaQuery = () => (targetWindow ?? window).matchMedia(pictureInPictureDisplayModeQuery);

  return (
    <ObjectViewerPanel
      id={id}
      heading={(
        <CodeHeading>
          <span className="method">matchMedia</span>(<ObjectViewString value={pictureInPictureDisplayModeQuery} />).
          <span className="property">matches</span>
        </CodeHeading>
      )}
      resource={onEvent(() => getMediaQuery().matches, getMediaQuery, 'change')}
    />
  );
}

type PictureInPictureWindowPanelProps = {
  pipWindow: Window | null | undefined;
  id: string;
};

function createCloseWindowAction(label: string): ActionSectionProps {
  return {
    buttonProps: { children: <code>{label}</code> },
    resource: () => eager(() => getPictureInPictureWindow()?.close()),
  };
}

export const pictureInPictureRequestResultActions = [createCloseWindowAction('window.close()')];
const pictureInPictureWindowActions = [
  createCloseWindowAction('window.documentPictureInPicture.window.close()'),
];

export function PictureInPictureWindowPanel({ pipWindow, id }: PictureInPictureWindowPanelProps) {
  return (
    <ObjectViewerPanel
      key={pipWindow ? 'open' : 'closed'}
      id={id}
      heading={(
        <PictureInPictureHeading>
          .<span className="property">window</span>
        </PictureInPictureHeading>
      )}
      name="window"
      resource={onEvent(getPictureInPictureWindow, () => pipWindow, 'resize', 'focus', 'blur')}
      actions={pipWindow ? pictureInPictureWindowActions : undefined}
      defaultIsExpanded={(_, path) => path.length === 0}
      sx={{ p: 2, minWidth: 0, overflowX: 'auto' }}
    />
  );
}

export function showPictureInPictureInspector(pipWindow: Window) {
  const { document } = pipWindow;
  document.title = 'Inspect Picture-in-Picture';
  const container = document.createElement('main');
  document.body.append(container);

  // Route content must be rendered into the PiP document because navigating it closes the window.
  const cache = createCache({ key: 'pip', container: document.head });
  const root = createRoot(container);
  pipWindow.addEventListener('pagehide', () => {
    root.unmount();
    cache.sheet.flush();
  }, { once: true });

  root.render(
    <CacheProvider value={cache}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Stack gap={4}>
          <PictureInPictureDisplayModePanel id="pip-display-mode" targetWindow={pipWindow} />
          <PictureInPictureWindowPanel pipWindow={pipWindow} id="pip-window" />
        </Stack>
      </ThemeProvider>
    </CacheProvider>,
  );
}
