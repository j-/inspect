import { createFileRoute, useLocation } from '@tanstack/react-router';
import { useCallback, useEffect, useState } from 'react';
import { ObjectViewerPanel } from '#/components/ObjectViewerPanel';
import { useViewerContext } from '#/viewer/providers';

export const Route = createFileRoute('/navigator.getBattery()')({
  component: RouteComponent,
});

const useGetThisObjectCustom = () => {
  const { rootObject, thisPath } = useViewerContext();

  const getValue = useCallback(() => {
    return thisPath.reduce((acc, { selector }) => (
      selector(acc)
    ), rootObject) as unknown;
  }, [rootObject, thisPath]);

  const [result, setResult] = useState(getValue);

  const updateValue = useCallback(() => {
    setResult(getValue);
  }, [getValue]);

  useEffect(() => {
    if (rootObject instanceof (window as any).BatteryManager !== true) return;
    const eventTarget = rootObject as EventTarget;

    eventTarget.addEventListener('chargingchange', updateValue);
    eventTarget.addEventListener('levelchange', updateValue);
    eventTarget.addEventListener('chargingtimechange', updateValue);
    eventTarget.addEventListener('dischargingtimechange', updateValue);

    return () => {
      eventTarget.removeEventListener('chargingchange', updateValue);
      eventTarget.removeEventListener('levelchange', updateValue);
      eventTarget.removeEventListener('chargingtimechange', updateValue);
      eventTarget.removeEventListener('dischargingtimechange', updateValue);
    };
  }, [rootObject, updateValue]);

  return result;
};

function RouteComponent() {
  const { pathname } = useLocation();

  return (
    <ObjectViewerPanel
      id={pathname}
      heading="navigator.getBattery()"
      initialValue={() => (navigator as any).getBattery()}
      useGetThisObject={useGetThisObjectCustom}
    />
  );
}
