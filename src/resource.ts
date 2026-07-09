export type ResourceState<T = unknown> =
  | { status: 'idle' }
  | { status: 'pending' }
  | { status: 'success'; value: T; evaluatedAt: number }
  | { status: 'error'; error: unknown; evaluatedAt: number };

export interface Resource<T = unknown> {
  /** Whether to call evaluate() automatically on mount. */
  autoEvaluate: boolean;
  /** Function that produces the inspected value. May return a Promise. */
  evaluate: () => T | Promise<T>;
  /**
   * Optional: register a side-channel trigger for automatic re-evaluation.
   * Called once on mount; must return a cleanup function.
   */
  createSubscription?: (trigger: () => void) => () => void;
  /**
   * Optional: register event-based triggers using the *resolved value* itself
   * as the event target. Called after each successful evaluation with the
   * resolved value. Must return a cleanup function.
   * Use this when the event source is the object being inspected
   * (e.g. a BatteryManager, MediaStream, etc.) rather than an external target.
   */
  createValueSubscription?: (value: unknown, trigger: () => void) => () => void;
  /** Label for the action button when status is 'idle'. Defaults to 'Evaluate'. */
  label?: string;
}

/**
 * Evaluate immediately on mount. User can manually re-evaluate.
 * Use this for most inspections.
 */
export function eager<T>(fn: () => T | Promise<T>): Resource<T> {
  return { autoEvaluate: true, evaluate: fn };
}

/**
 * Only evaluate when the user explicitly triggers it.
 * Use this for actions that open dialogs, require permissions, or are otherwise
 * disruptive to trigger automatically on page load.
 */
export function lazy<T>(fn: () => T | Promise<T>, label = 'Evaluate'): Resource<T> {
  return { autoEvaluate: false, evaluate: fn, label };
}

/**
 * Evaluate immediately on mount, then re-evaluate automatically every
 * `intervalMs` milliseconds.
 * Use this for values that change continuously (e.g. navigator.userActivation).
 */
export function polling<T>(fn: () => T | Promise<T>, intervalMs: number): Resource<T> {
  return {
    autoEvaluate: true,
    evaluate: fn,
    createSubscription: (trigger) => {
      const id = setInterval(trigger, intervalMs);
      return () => clearInterval(id);
    },
  };
}

/**
 * Evaluate immediately on mount, then re-evaluate whenever any of the specified
 * DOM events fire on the given target.
 * Use this for values that change in response to user or network activity
 * (e.g. navigator.onLine, navigator.connection).
 *
 * @param getTarget - Factory for the event target. Called lazily to avoid SSR
 *   issues. Return null/undefined to skip subscription silently.
 * @param eventTypes - One or more DOM event type names to listen for.
 */
export function onEvent<T>(
  fn: () => T | Promise<T>,
  getTarget: () => EventTarget | null | undefined,
  ...eventTypes: string[]
): Resource<T> {
  return {
    autoEvaluate: true,
    evaluate: fn,
    createSubscription: (trigger) => {
      const target = getTarget();
      if (!target) return () => {};
      for (const type of eventTypes) {
        target.addEventListener(type, trigger);
      }
      return () => {
        for (const type of eventTypes) {
          target.removeEventListener(type, trigger);
        }
      };
    },
  };
}

/**
 * Evaluate immediately on mount, then re-evaluate whenever any of the specified
 * DOM events fire on the resolved value itself.
 * Use this when the object being inspected is also the event source
 * (e.g. BatteryManager, MediaStream, RTCPeerConnection).
 */
export function reactive<T extends EventTarget>(
  fn: () => T | Promise<T>,
  ...eventTypes: string[]
): Resource<T> {
  return {
    autoEvaluate: true,
    evaluate: fn,
    createValueSubscription: makeValueSubscription<T>(...eventTypes),
  };
}

/**
 * Only evaluate when the user explicitly triggers it, then re-evaluate
 * automatically whenever any of the specified DOM events fire on the resolved
 * value itself.
 * Use this for APIs that require a permission prompt but then expose a live
 * object whose events should drive re-renders (e.g. window.getScreenDetails()).
 */
export function lazyReactive<T extends EventTarget>(
  fn: () => T | Promise<T>,
  ...eventTypes: string[]
): Resource<T> {
  return {
    autoEvaluate: false,
    evaluate: fn,
    label: 'Evaluate',
    createValueSubscription: makeValueSubscription<T>(...eventTypes),
  };
}

function makeValueSubscription<T extends EventTarget>(
  ...eventTypes: string[]
): (value: unknown, trigger: () => void) => () => void {
  return (value, trigger) => {
    const target = value as T; // evaluate() always resolves to T
    for (const type of eventTypes) {
      target.addEventListener(type, trigger);
    }
    return () => {
      for (const type of eventTypes) {
        target.removeEventListener(type, trigger);
      }
    };
  };
}
