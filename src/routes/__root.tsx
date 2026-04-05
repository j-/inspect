import createCache from '@emotion/cache';
import { CacheProvider } from '@emotion/react';
import fontsourceVariableRobotoCss from '@fontsource-variable/roboto?url';
import Box from '@mui/material/Box';
import CssBaseline from '@mui/material/CssBaseline';
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import { ThemeProvider } from '@mui/material/styles';
import { TanStackDevtools } from '@tanstack/react-devtools';
import { HeadContent, Scripts, createRootRoute } from '@tanstack/react-router';
import { TanStackRouterDevtoolsPanel } from '@tanstack/react-router-devtools';
import { MenuConnected } from '#/components/MenuConnected';
import { theme } from '#/theme';

export const Route = createRootRoute({
  head: () => ({
    meta: [
      {
        charSet: 'utf-8',
      },
      {
        name: 'viewport',
        content: 'width=device-width, initial-scale=1',
      },
      {
        title: 'Inspect',
      },
    ],
    links: [
      {
        rel: 'stylesheet',
        href: fontsourceVariableRobotoCss,
      },
    ],
  }),
  shellComponent: RootDocument,
  notFoundComponent: () => <div>Not found</div>,
});

function RootDocument({ children }: { children: React.ReactNode }) {
  const emotionCache = createCache({ key: 'css' });

  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <HeadContent />
      </head>
      <body className="font-sans antialiased wrap-anywhere">
        <CacheProvider value={emotionCache}>
          <ThemeProvider theme={theme}>
            <CssBaseline />

            <Stack
              component="main"
              gap={4}
              direction={{
                sm: 'column',
                lg: 'row',
              }}
              sx={{
                m: 4,
              }}
            >
              <Paper
                sx={{
                  p: 2,
                  maxWidth: '60ch',
                  alignSelf: 'start',
                }}
              >
                <MenuConnected />
              </Paper>

              <Box flex={1}>
                {children}
              </Box>
            </Stack>
          </ThemeProvider>
        </CacheProvider>

        <TanStackDevtools
          config={{
            position: 'bottom-right',
          }}
          plugins={[
            {
              name: 'Tanstack Router',
              render: <TanStackRouterDevtoolsPanel />,
            },
          ]}
        />

        <Scripts />
      </body>
    </html>
  );
}
