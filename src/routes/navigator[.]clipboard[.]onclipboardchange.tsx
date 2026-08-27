import Stack from '@mui/material/Stack';
import { createFileRoute, useLocation } from '@tanstack/react-router';
import { useCallback, useEffect, useState } from 'react';
import { ObjectViewerPanel } from '#/components/ObjectViewerPanel';
import { eager } from '#/resource';

export const Route = createFileRoute('/navigator.clipboard.onclipboardchange')({
  component: RouteComponent,
});

function ClipboardChangeEventItem({
  event,
  pathname,
  onRemove,
}: {
  event: Event;
  pathname: string;
  onRemove: (event: Event) => void;
}) {
  const removeResource = useCallback(
    () => eager(() => onRemove(event)),
    [event, onRemove],
  );

  return (
    <ObjectViewerPanel
      id={pathname + '#' + event.timeStamp}
      heading={`clipboardchange event (${event.timeStamp})`}
      name="event"
      resource={eager(() => event)}
      actions={[
        {
          buttonProps: {
            children: 'Remove',
          },
          resource: removeResource,
        },
      ]}
    />
  );
}

function RouteComponent() {
  const { pathname } = useLocation();
  const [events, setEvents] = useState<Event[]>(() => []);

  const pushEvent = useCallback((event: Event) => (
    setEvents((events) => [event, ...events])
  ), []);

  const clearEvents = useCallback(() => (
    setEvents([])
  ), []);

  const clearEventsResource = useCallback(
    () => eager(() => clearEvents()),
    [clearEvents],
  );

  const removeEvent = useCallback((event: Event) => (
    setEvents((events) => events.filter((e) => e !== event))
  ), []);

  useEffect(() => {
    const controller = new AbortController();
    const { signal } = controller;

    navigator.clipboard.addEventListener('clipboardchange', (e) => {
      pushEvent(e);
    }, { signal });

    return () => controller.abort();
  }, [pushEvent]);

  return (
    <Stack gap={4}>
      <ObjectViewerPanel
        id={pathname}
        heading="'onclipboardchange' in navigator.clipboard"
        resource={eager(() => 'onclipboardchange' in navigator.clipboard)}
        actions={[
          {
            buttonProps: {
              children: 'Clear',
            },
            resource: clearEventsResource,
          },
        ]}
      />

      {events.map((event) => (
        <ClipboardChangeEventItem
          key={event.timeStamp}
          event={event}
          pathname={pathname}
          onRemove={removeEvent}
        />
      ))}
    </Stack>
  );
}
