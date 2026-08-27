import { createFileRoute, useLocation } from '@tanstack/react-router';
import { ObjectViewerPanel } from '#/components/ObjectViewerPanel';
import type { Resource } from '#/resource';
import type { PathCommentFunction } from '#/viewer/types';

// Standard gamepad mapping per the W3C Gamepad spec
const BUTTON_LABELS: Record<number, string> = {
  0: 'Bottom face (A / Cross)',
  1: 'Right face (B / Circle)',
  2: 'Left face (X / Square)',
  3: 'Top face (Y / Triangle)',
  4: 'Left bumper (L1)',
  5: 'Right bumper (R1)',
  6: 'Left trigger (L2)',
  7: 'Right trigger (R2)',
  8: 'Select / Back',
  9: 'Start',
  10: 'Left stick click (L3)',
  11: 'Right stick click (R3)',
  12: 'D-pad up',
  13: 'D-pad down',
  14: 'D-pad left',
  15: 'D-pad right',
  16: 'Home / Guide',
};

const AXES_LABELS: Record<number, string> = {
  0: 'Left stick horizontal',
  1: 'Left stick vertical',
  2: 'Right stick horizontal',
  3: 'Right stick vertical',
};

const getComment: PathCommentFunction = (path, key) => {
  const parent = path[path.length - 1];
  if (parent === 'buttons') return BUTTON_LABELS[key as number] ?? null;
  if (parent === 'axes') return AXES_LABELS[key as number] ?? null;
  return null;
};

const gamepadResource: Resource = {
  autoEvaluate: true,
  evaluate: () => navigator.getGamepads(),
  createSubscription: (trigger) => {
    let rafId: number;
    const loop = () => {
      trigger();
      rafId = requestAnimationFrame(loop);
    };
    rafId = requestAnimationFrame(loop);
    window.addEventListener('gamepadconnected', trigger);
    window.addEventListener('gamepaddisconnected', trigger);
    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener('gamepadconnected', trigger);
      window.removeEventListener('gamepaddisconnected', trigger);
    };
  },
};

export const Route = createFileRoute('/navigator.getGamepads()')({
  component: RouteComponent,
});

function RouteComponent() {
  const { pathname } = useLocation();

  return (
    <ObjectViewerPanel
      id={pathname}
      heading="navigator.getGamepads()"
      getComment={getComment}
      resource={gamepadResource}
    />
  );
}
