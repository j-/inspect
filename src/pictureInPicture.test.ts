import { afterEach, expect, it, vi } from 'vitest';
import {
  getPictureInPictureWindow,
  getPictureInPictureWindowKeys,
  rememberPictureInPictureWindow,
  subscribeToPictureInPictureResult,
} from './pictureInPicture';

afterEach(() => {
  vi.unstubAllGlobals();
  vi.useRealTimers();
});

it('stops inspecting a PiP window on pagehide before the browser clears its window value', () => {
  const pipWindow = Object.assign(new EventTarget(), { closed: false });
  const api: { window: typeof pipWindow | null } = { window: pipWindow };
  vi.stubGlobal('window', { documentPictureInPicture: api });
  rememberPictureInPictureWindow(pipWindow as unknown as Window);

  expect(getPictureInPictureWindow()).toBe(pipWindow);
  expect(getPictureInPictureWindowKeys(pipWindow)?.has('document')).toBe(true);

  pipWindow.dispatchEvent(new Event('pagehide'));

  expect(getPictureInPictureWindow()).toBeNull();
  expect(getPictureInPictureWindowKeys(pipWindow)).toEqual(new Set(['closed']));

  api.window = null;
  expect(getPictureInPictureWindow()).toBeNull();
  expect(getPictureInPictureWindowKeys(pipWindow)).toEqual(new Set(['closed']));
});

it('refreshes the request result once the native closed getter changes after pagehide', () => {
  vi.useFakeTimers();
  vi.stubGlobal('requestAnimationFrame', (callback: FrameRequestCallback) => setTimeout(() => callback(0), 16));
  vi.stubGlobal('cancelAnimationFrame', clearTimeout);
  const pipWindow = Object.assign(new EventTarget(), { closed: false });
  const refresh = vi.fn();
  const unsubscribe = subscribeToPictureInPictureResult(pipWindow as unknown as Window, refresh);

  pipWindow.dispatchEvent(new Event('resize'));
  expect(refresh).toHaveBeenCalledTimes(1);

  pipWindow.dispatchEvent(new Event('pagehide'));
  vi.advanceTimersByTime(16);
  expect(refresh).toHaveBeenCalledTimes(1);

  pipWindow.closed = true;
  vi.advanceTimersByTime(16);
  expect(refresh).toHaveBeenCalledTimes(2);

  unsubscribe();
});
