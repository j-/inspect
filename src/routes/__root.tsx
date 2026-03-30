import createCache from '@emotion/cache';
import { CacheProvider } from '@emotion/react';
import fontsourceVariableRobotoCss from '@fontsource-variable/roboto?url';
import CssBaseline from '@mui/material/CssBaseline';
import { ThemeProvider } from '@mui/material/styles';
import { TanStackDevtools } from '@tanstack/react-devtools';
import { HeadContent, Scripts, createRootRoute } from '@tanstack/react-router';
import { TanStackRouterDevtoolsPanel } from '@tanstack/react-router-devtools';
import Footer from '../components/Footer';
import Header from '../components/Header';
import appCss from '../styles.css?url';
import { theme } from '#/theme';

const THEME_INIT_SCRIPT = '(function(){try{var stored=window.localStorage.getItem(\'theme\');var mode=(stored===\'light\'||stored===\'dark\'||stored===\'auto\')?stored:\'auto\';var prefersDark=window.matchMedia(\'(prefers-color-scheme: dark)\').matches;var resolved=mode===\'auto\'?(prefersDark?\'dark\':\'light\'):mode;var root=document.documentElement;root.classList.remove(\'light\',\'dark\');root.classList.add(resolved);if(mode===\'auto\'){root.removeAttribute(\'data-theme\')}else{root.setAttribute(\'data-theme\',mode)}root.style.colorScheme=resolved;}catch(e){}})();';

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
        title: 'TanStack Start Starter',
      },
    ],
    links: [
      {
        rel: 'stylesheet',
        href: appCss,
      },
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
        <script dangerouslySetInnerHTML={{ __html: THEME_INIT_SCRIPT }} />
        <HeadContent />
      </head>
      <body className="font-sans antialiased wrap-anywhere selection:bg-[rgba(79,184,178,0.24)]">
        <CacheProvider value={emotionCache}>
          <ThemeProvider theme={theme}>
            <CssBaseline />
            <Header />
            {children}
            <Footer />
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
          </ThemeProvider>
        </CacheProvider>
        <Scripts />
      </body>
    </html>
  );
}
