const pictureInPictureWindowKeys = new Set<PropertyKey>([
  'closed',
  'devicePixelRatio',
  'document',
  'innerHeight',
  'innerWidth',
  'outerHeight',
  'outerWidth',
  'screenX',
  'screenY',
  'visualViewport',
  'onpagehide',
  'onpageshow',
  'onresize',
  'addEventListener',
  'dispatchEvent',
  'removeEventListener',
  'requestWindow',
  'when',
]);

const closedPictureInPictureWindowKeys = new Set<PropertyKey>(['closed']);
const knownWindows = new WeakMap<object, boolean>();

export function rememberPictureInPictureWindow(pipWindow: Window) {
  if (knownWindows.has(pipWindow)) return;

  knownWindows.set(pipWindow, false);
  // The browser can still expose this window while it dispatches pagehide.
  pipWindow.addEventListener('pagehide', () => knownWindows.set(pipWindow, true), { once: true });
}

export function getPictureInPictureWindow(): Window | null | undefined {
  const pipWindow = typeof window === 'undefined' ? undefined : window.documentPictureInPicture?.window;
  return pipWindow && (knownWindows.get(pipWindow) || pipWindow.closed) ? null : pipWindow;
}

export function getPictureInPictureWindowKeys(object: object): ReadonlySet<PropertyKey> | undefined {
  if (object === getPictureInPictureWindow()) return pictureInPictureWindowKeys;
  return knownWindows.has(object) ? closedPictureInPictureWindowKeys : undefined;
}

export function subscribeToPictureInPictureResult(pipWindow: Window, refresh: () => void) {
  let closeRefresh: number | undefined;
  const refreshWhenClosed = () => {
    if (pipWindow.closed) refresh();
    else closeRefresh = requestAnimationFrame(refreshWhenClosed);
  };
  const onPageHide = () => {
    // pagehide can fire before the browser updates the native closed getter.
    closeRefresh = requestAnimationFrame(refreshWhenClosed);
  };

  pipWindow.addEventListener('resize', refresh);
  pipWindow.addEventListener('pagehide', onPageHide, { once: true });
  return () => {
    if (closeRefresh !== undefined) cancelAnimationFrame(closeRefresh);
    pipWindow.removeEventListener('resize', refresh);
    pipWindow.removeEventListener('pagehide', onPageHide);
  };
}
