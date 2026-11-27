import MenuItem from '@mui/material/MenuItem';
import Stack from '@mui/material/Stack';
import { createFileRoute, useLocation } from '@tanstack/react-router';
import { useState, useSyncExternalStore } from 'react';
import { ObjectViewerPanel } from '#/components/ObjectViewerPanel';
import {
  PictureInPictureDisplayModePanel,
  PictureInPictureHeading,
  pictureInPictureRequestResultActions,
  PictureInPictureWindowPanel,
  showPictureInPictureInspector,
} from '#/components/PictureInPictureWindowPanel';
import { RequestOptionField } from '#/components/RequestOptionField';
import {
  getPictureInPictureWindow,
  rememberPictureInPictureWindow,
  subscribeToPictureInPictureResult,
} from '#/pictureInPicture';
import { lazy, onEvent } from '#/resource';
import { ObjectViewBoolean } from '#/viewer/ObjectViewBoolean';
import { ObjectViewNumber } from '#/viewer/ObjectViewNumber';

export const Route = createFileRoute('/window.documentPictureInPicture')({
  component: RouteComponent,
});

const dimensions = ['width', 'height'] as const;
const flags = ['disallowReturnToOpener', 'preferInitialWindowPlacement'] as const;

function subscribeToPictureInPictureWindow(notify: () => void) {
  const api = window.documentPictureInPicture;
  let pipWindow: Window | null | undefined;

  function observeWindow() {
    pipWindow?.removeEventListener('pagehide', notify);
    pipWindow = getPictureInPictureWindow();
    if (pipWindow) {
      rememberPictureInPictureWindow(pipWindow);
      pipWindow.addEventListener('pagehide', notify);
    }
  }

  const onEnter = () => {
    observeWindow();
    notify();
  };

  observeWindow();
  api?.addEventListener('enter', onEnter);
  return () => {
    api?.removeEventListener('enter', onEnter);
    pipWindow?.removeEventListener('pagehide', notify);
  };
}

function RouteComponent() {
  const { pathname } = useLocation();
  const [options, setOptions] = useState<DocumentPictureInPictureOptions>({});
  const pipWindow = useSyncExternalStore(subscribeToPictureInPictureWindow, getPictureInPictureWindow, () => undefined);

  function setOption<Key extends keyof DocumentPictureInPictureOptions>(
    name: Key,
    value: DocumentPictureInPictureOptions[Key],
  ) {
    setOptions((current) => {
      const next = { ...current };
      if (value === undefined) delete next[name];
      else next[name] = value;
      return next;
    });
  }

  async function requestWindow() {
    const api = window.documentPictureInPicture;
    if (!api) throw new DOMException('Document Picture-in-Picture is unavailable', 'NotSupportedError');

    const pipWindow = await (Object.keys(options).length ? api.requestWindow(options) : api.requestWindow());
    rememberPictureInPictureWindow(pipWindow);
    showPictureInPictureInspector(pipWindow);
    return pipWindow;
  }

  return (
    <Stack gap={4}>
      <ObjectViewerPanel
        id={`${pathname}#api`}
        heading={<PictureInPictureHeading />}
        name="window.documentPictureInPicture"
        resource={onEvent(() => window.documentPictureInPicture, () => pipWindow, 'resize')}
        defaultIsExpanded={(_, path) => path.length === 0}
      />

      <Stack gap={2}>
        <Stack direction="row" gap={1} flexWrap="wrap">
          {dimensions.map((name) => (
            <RequestOptionField
              key={name}
              id={`${pathname}/${name}`}
              label={name}
              type="number"
              value={options[name]?.toString() ?? ''}
              onChange={(value) => setOption(name, value === '' ? undefined : Number(value))}
            />
          ))}

          {flags.map((name) => (
            <RequestOptionField
              key={name}
              id={`${pathname}/${name}`}
              label={name}
              value={String(options[name])}
              onChange={(value) => setOption(name, value === 'undefined' ? undefined : value === 'true')}
            >
              <MenuItem value="false"><ObjectViewBoolean value={false} /></MenuItem>
              <MenuItem value="true"><ObjectViewBoolean value={true} /></MenuItem>
            </RequestOptionField>
          ))}
        </Stack>

        <ObjectViewerPanel
          key={JSON.stringify(options)}
          id={`${pathname}#requestWindow`}
          heading={<RequestHeading options={options} />}
          resource={{
            ...lazy(requestWindow),
            createValueSubscription: (value, _, refresh) => subscribeToPictureInPictureResult(value as Window, refresh),
          }}
          actions={pipWindow ? pictureInPictureRequestResultActions : undefined}
          defaultIsExpanded={(_, path) => path.length === 0}
          sx={{ p: 2, minWidth: 0, overflowX: 'auto' }}
        />
      </Stack>

      <PictureInPictureDisplayModePanel id={`${pathname}#displayMode`} />
      <PictureInPictureWindowPanel pipWindow={pipWindow} id={`${pathname}#window`} />
    </Stack>
  );
}

function RequestHeading({ options }: { options: DocumentPictureInPictureOptions }) {
  const entries = Object.entries(options);

  return (
    <PictureInPictureHeading>
      .<span className="method">requestWindow</span>(
      {entries.length > 0 && (
        <>
          {'{\n'}
          {entries.map(([name, value]) => (
            <span key={name}>
              {'  '}
              <span className="property">{name}</span>
              {': '}
              {typeof value === 'number' ? <ObjectViewNumber value={value} /> : <ObjectViewBoolean value={value} />}
              {',\n'}
            </span>
          ))}
          {'}'}
        </>
      )}
      {')'}
    </PictureInPictureHeading>
  );
}
