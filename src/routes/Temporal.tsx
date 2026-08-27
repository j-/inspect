import Stack from '@mui/material/Stack';
import { createFileRoute, useLocation } from '@tanstack/react-router';
import { ObjectViewerPanel } from '#/components/ObjectViewerPanel';
import { eager } from '#/resource';

export const Route = createFileRoute('/Temporal')({
  component: RouteComponent,
});

function RouteComponent() {
  const { pathname } = useLocation();

  return (
    <Stack gap={4}>
      <ObjectViewerPanel
        id={pathname}
        heading="Temporal"
        name="Temporal"
        resource={eager(() => Temporal)}
      />

      <ObjectViewerPanel
        id={pathname + '#Now'}
        heading="Temporal.Now"
        name="Temporal.Now"
        resource={eager(() => Temporal.Now)}
        actions={[
          {
            buttonProps: { children: <code>.instant()</code> },
            resource: () => eager(() => Temporal.Now.instant()),
          },
          {
            buttonProps: { children: <code>.plainDateISO()</code> },
            resource: () => eager(() => Temporal.Now.plainDateISO()),
          },
          {
            buttonProps: { children: <code>.plainTimeISO()</code> },
            resource: () => eager(() => Temporal.Now.plainTimeISO()),
          },
          {
            buttonProps: { children: <code>.plainDateTimeISO()</code> },
            resource: () => eager(() => Temporal.Now.plainDateTimeISO()),
          },
          {
            buttonProps: { children: <code>.zonedDateTimeISO()</code> },
            resource: () => eager(() => Temporal.Now.zonedDateTimeISO()),
          },
          {
            buttonProps: { children: <code>.timeZoneId()</code> },
            resource: () => eager(() => Temporal.Now.timeZoneId()),
          },
        ]}
      />

      <ObjectViewerPanel
        id={pathname + '#Duration'}
        heading="new Temporal.Duration(1, 2, 0, 3)"
        name="new Temporal.Duration(1, 2, 0, 3)"
        resource={eager(() => new Temporal.Duration(1, 2, 0, 3))}
        actions={[
          {
            buttonProps: { children: <code>.toString()</code> },
            resource: (v) => eager(() => (v as Temporal.Duration).toString()),
          },
          {
            buttonProps: { children: <code>.toJSON()</code> },
            resource: (v) => eager(() => (v as Temporal.Duration).toJSON()),
          },
          {
            buttonProps: { children: <code>.abs()</code> },
            resource: (v) => eager(() => (v as Temporal.Duration).abs()),
          },
          {
            buttonProps: { children: <code>.negated()</code> },
            resource: (v) => eager(() => (v as Temporal.Duration).negated()),
          },
          {
            buttonProps: { children: <code>.sign</code> },
            resource: (v) => eager(() => (v as Temporal.Duration).sign),
          },
          {
            buttonProps: { children: <code>.blank</code> },
            resource: (v) => eager(() => (v as Temporal.Duration).blank),
          },
        ]}
      />

      <ObjectViewerPanel
        id={pathname + '#Temporal.Now.instant'}
        heading="Temporal.Now.instant()"
        name="Temporal.Now.instant()"
        resource={eager(() => Temporal.Now.instant())}
        actions={[
          {
            buttonProps: { children: <code>.toString()</code> },
            resource: (v) => eager(() => (v as Temporal.Instant).toString()),
          },
          {
            buttonProps: { children: <code>.toJSON()</code> },
            resource: (v) => eager(() => (v as Temporal.Instant).toJSON()),
          },
          {
            buttonProps: { children: <code>.toZonedDateTimeISO('UTC')</code> },
            resource: (v) => eager(() => (v as Temporal.Instant).toZonedDateTimeISO('UTC')),
          },
          {
            buttonProps: { children: <code>.until(Temporal.Now.instant())</code> },
            resource: (v) => eager(() => (v as Temporal.Instant).until(Temporal.Now.instant())),
          },
        ]}
      />

      <ObjectViewerPanel
        id={pathname + '#Instant'}
        heading="new Temporal.Instant(0n)"
        name="new Temporal.Instant(0n)"
        resource={eager(() => new Temporal.Instant(0n))}
        actions={[
          {
            buttonProps: { children: <code>.toString()</code> },
            resource: (v) => eager(() => (v as Temporal.Instant).toString()),
          },
          {
            buttonProps: { children: <code>.toJSON()</code> },
            resource: (v) => eager(() => (v as Temporal.Instant).toJSON()),
          },
          {
            buttonProps: { children: <code>.epochMilliseconds</code> },
            resource: (v) => eager(() => (v as Temporal.Instant).epochMilliseconds),
          },
          {
            buttonProps: { children: <code>.epochNanoseconds</code> },
            resource: (v) => eager(() => (v as Temporal.Instant).epochNanoseconds),
          },
          {
            buttonProps: { children: <code>.toZonedDateTimeISO('UTC')</code> },
            resource: (v) => eager(() => (v as Temporal.Instant).toZonedDateTimeISO('UTC')),
          },
          {
            buttonProps: { children: <code>.until(Temporal.Now.instant())</code> },
            resource: (v) => eager(() => (v as Temporal.Instant).until(Temporal.Now.instant())),
          },
        ]}
      />

      <ObjectViewerPanel
        id={pathname + '#PlainDate'}
        heading="new Temporal.PlainDate(2000, 1, 1)"
        name="new Temporal.PlainDate(2000, 1, 1)"
        resource={eager(() => new Temporal.PlainDate(2000, 1, 1))}
        actions={[
          {
            buttonProps: { children: <code>.toString()</code> },
            resource: (v) => eager(() => (v as Temporal.PlainDate).toString()),
          },
          {
            buttonProps: { children: <code>.toJSON()</code> },
            resource: (v) => eager(() => (v as Temporal.PlainDate).toJSON()),
          },
          {
            buttonProps: { children: <code>.toPlainDateTime()</code> },
            resource: (v) => eager(() => (v as Temporal.PlainDate).toPlainDateTime()),
          },
          {
            buttonProps: { children: <code>.toZonedDateTime('UTC')</code> },
            resource: (v) => eager(() => (v as Temporal.PlainDate).toZonedDateTime('UTC')),
          },
          {
            buttonProps: { children: <code>.until(Temporal.Now.plainDateISO())</code> },
            resource: (v) => eager(() => (v as Temporal.PlainDate).until(Temporal.Now.plainDateISO())),
          },
        ]}
      />

      <ObjectViewerPanel
        id={pathname + '#PlainTime'}
        heading="new Temporal.PlainTime(12, 0, 0)"
        name="new Temporal.PlainTime(12, 0, 0)"
        resource={eager(() => new Temporal.PlainTime(12, 0, 0))}
        actions={[
          {
            buttonProps: { children: <code>.toString()</code> },
            resource: (v) => eager(() => (v as Temporal.PlainTime).toString()),
          },
          {
            buttonProps: { children: <code>.toJSON()</code> },
            resource: (v) => eager(() => (v as Temporal.PlainTime).toJSON()),
          },
          {
            buttonProps: { children: <code>.until(Temporal.Now.plainTimeISO())</code> },
            resource: (v) => eager(() => (v as Temporal.PlainTime).until(Temporal.Now.plainTimeISO())),
          },
        ]}
      />

      <ObjectViewerPanel
        id={pathname + '#PlainDateTime'}
        heading="new Temporal.PlainDateTime(2000, 1, 1, 12, 0, 0)"
        name="new Temporal.PlainDateTime(2000, 1, 1, 12, 0, 0)"
        resource={eager(() => new Temporal.PlainDateTime(2000, 1, 1, 12, 0, 0))}
        actions={[
          {
            buttonProps: { children: <code>.toString()</code> },
            resource: (v) => eager(() => (v as Temporal.PlainDateTime).toString()),
          },
          {
            buttonProps: { children: <code>.toJSON()</code> },
            resource: (v) => eager(() => (v as Temporal.PlainDateTime).toJSON()),
          },
          {
            buttonProps: { children: <code>.toPlainDate()</code> },
            resource: (v) => eager(() => (v as Temporal.PlainDateTime).toPlainDate()),
          },
          {
            buttonProps: { children: <code>.toPlainTime()</code> },
            resource: (v) => eager(() => (v as Temporal.PlainDateTime).toPlainTime()),
          },
          {
            buttonProps: { children: <code>.toZonedDateTime('UTC')</code> },
            resource: (v) => eager(() => (v as Temporal.PlainDateTime).toZonedDateTime('UTC')),
          },
          {
            buttonProps: { children: <code>.until(Temporal.Now.plainDateTimeISO())</code> },
            resource: (v) => eager(() => (v as Temporal.PlainDateTime).until(Temporal.Now.plainDateTimeISO())),
          },
        ]}
      />

      <ObjectViewerPanel
        id={pathname + '#PlainYearMonth'}
        heading="new Temporal.PlainYearMonth(2000, 1)"
        name="new Temporal.PlainYearMonth(2000, 1)"
        resource={eager(() => new Temporal.PlainYearMonth(2000, 1))}
        actions={[
          {
            buttonProps: { children: <code>.toString()</code> },
            resource: (v) => eager(() => (v as Temporal.PlainYearMonth).toString()),
          },
          {
            buttonProps: { children: <code>.toJSON()</code> },
            resource: (v) => eager(() => (v as Temporal.PlainYearMonth).toJSON()),
          },
          {
            buttonProps: { children: <code>.toPlainDate({'{ day: 1 }'})</code> },
            resource: (v) => eager(() => (v as Temporal.PlainYearMonth).toPlainDate({ day: 1 })),
          },
          {
            buttonProps: { children: <code>.daysInMonth</code> },
            resource: (v) => eager(() => (v as Temporal.PlainYearMonth).daysInMonth),
          },
          {
            buttonProps: { children: <code>.until(Temporal.Now.plainDateISO().toPlainYearMonth())</code> },
            resource: (v) => eager(() => (v as Temporal.PlainYearMonth).until(Temporal.Now.plainDateISO().toPlainYearMonth())),
          },
        ]}
      />

      <ObjectViewerPanel
        id={pathname + '#PlainMonthDay'}
        heading="new Temporal.PlainMonthDay(1, 1)"
        name="new Temporal.PlainMonthDay(1, 1)"
        resource={eager(() => new Temporal.PlainMonthDay(1, 1))}
        actions={[
          {
            buttonProps: { children: <code>.toString()</code> },
            resource: (v) => eager(() => (v as Temporal.PlainMonthDay).toString()),
          },
          {
            buttonProps: { children: <code>.toJSON()</code> },
            resource: (v) => eager(() => (v as Temporal.PlainMonthDay).toJSON()),
          },
          {
            buttonProps: { children: <code>.toPlainDate({'{ year: 2000 }'})</code> },
            resource: (v) => eager(() => (v as Temporal.PlainMonthDay).toPlainDate({ year: 2000 })),
          },
        ]}
      />

      <ObjectViewerPanel
        id={pathname + '#ZonedDateTime'}
        heading="new Temporal.ZonedDateTime(0n, 'UTC')"
        name="new Temporal.ZonedDateTime(0n, 'UTC')"
        resource={eager(() => new Temporal.ZonedDateTime(0n, 'UTC'))}
        actions={[
          {
            buttonProps: { children: <code>.toString()</code> },
            resource: (v) => eager(() => (v as Temporal.ZonedDateTime).toString()),
          },
          {
            buttonProps: { children: <code>.toJSON()</code> },
            resource: (v) => eager(() => (v as Temporal.ZonedDateTime).toJSON()),
          },
          {
            buttonProps: { children: <code>.toInstant()</code> },
            resource: (v) => eager(() => (v as Temporal.ZonedDateTime).toInstant()),
          },
          {
            buttonProps: { children: <code>.toPlainDate()</code> },
            resource: (v) => eager(() => (v as Temporal.ZonedDateTime).toPlainDate()),
          },
          {
            buttonProps: { children: <code>.toPlainTime()</code> },
            resource: (v) => eager(() => (v as Temporal.ZonedDateTime).toPlainTime()),
          },
          {
            buttonProps: { children: <code>.toPlainDateTime()</code> },
            resource: (v) => eager(() => (v as Temporal.ZonedDateTime).toPlainDateTime()),
          },
          {
            buttonProps: { children: <code>.until(Temporal.Now.zonedDateTimeISO())</code> },
            resource: (v) => eager(() => (v as Temporal.ZonedDateTime).until(Temporal.Now.zonedDateTimeISO())),
          },
        ]}
      />
    </Stack>
  );
}
