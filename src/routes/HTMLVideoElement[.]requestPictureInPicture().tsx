import Box from '@mui/material/Box';
import Checkbox from '@mui/material/Checkbox';
import FormControlLabel from '@mui/material/FormControlLabel';
import Stack from '@mui/material/Stack';
import { createFileRoute, useLocation } from '@tanstack/react-router';
import { useState } from 'react';
import sampleVideoUrl from '#/assets/picture-in-picture.mp4?url';
import { ObjectViewerPanel } from '#/components/ObjectViewerPanel';
import { lazy, onEvent } from '#/resource';

export const Route = createFileRoute('/HTMLVideoElement.requestPictureInPicture()')({
  component: RouteComponent,
});

// These properties are absent from some versions of lib.dom.d.ts.
type PictureInPictureDocument = Document & {
  readonly pictureInPictureEnabled?: boolean;
  readonly pictureInPictureElement?: Element | null;
};

function RouteComponent() {
  const { pathname } = useLocation();
  const [video, setVideo] = useState<HTMLVideoElement | null>(null);
  const [disabled, setDisabled] = useState(false);

  function requestPictureInPicture() {
    if (!video?.requestPictureInPicture) {
      throw new DOMException('Video Picture-in-Picture is unavailable', 'NotSupportedError');
    }
    return video.requestPictureInPicture();
  }

  return (
    <Stack gap={2}>
      <Box
        component="video"
        ref={setVideo}
        src={sampleVideoUrl}
        aria-label="Picture-in-Picture test video"
        controls
        muted
        loop
        playsInline
        preload="auto"
        disablePictureInPicture={disabled}
        sx={{ display: 'block', maxWidth: '100%', width: 320 }}
      />
      <FormControlLabel
        control={<Checkbox checked={disabled} onChange={(_, checked) => setDisabled(checked)} />}
        label={<code>video.disablePictureInPicture</code>}
      />

      <ObjectViewerPanel
        id={`${pathname}#requestPictureInPicture`}
        heading="video.requestPictureInPicture()"
        resource={lazy(requestPictureInPicture, 'Request video PiP')}
      />
      <ObjectViewerPanel
        id={`${pathname}#pictureInPictureEnabled`}
        heading="document.pictureInPictureEnabled"
        name="document.pictureInPictureEnabled"
        resource={onEvent(
          () => (document as PictureInPictureDocument).pictureInPictureEnabled,
          () => video,
          'enterpictureinpicture',
          'leavepictureinpicture',
        )}
      />
      <ObjectViewerPanel
        id={`${pathname}#pictureInPictureElement`}
        heading="document.pictureInPictureElement"
        name="document.pictureInPictureElement"
        resource={onEvent(
          () => (document as PictureInPictureDocument).pictureInPictureElement,
          () => video,
          'enterpictureinpicture',
          'leavepictureinpicture',
        )}
        defaultIsExpanded={(_, path) => path.length === 0}
      />
      <ObjectViewerPanel
        id={`${pathname}#exitPictureInPicture`}
        heading="document.exitPictureInPicture()"
        resource={lazy(() => document.exitPictureInPicture(), 'Exit video PiP')}
      />
    </Stack>
  );
}
