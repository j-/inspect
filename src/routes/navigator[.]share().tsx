import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Checkbox from '@mui/material/Checkbox';
import FormControlLabel from '@mui/material/FormControlLabel';
import Stack from '@mui/material/Stack';
import { ThemeProvider } from '@mui/material/styles';
import TextField from '@mui/material/TextField';
import { createFileRoute, useLocation } from '@tanstack/react-router';
import { useState, type FC } from 'react';
import { ObjectViewerPanel } from '#/components/ObjectViewerPanel';
import { lazy } from '#/resource';
import { codeTheme } from '#/theme';
import { ObjectSymbol } from '#/viewer/ObjectSymbol';
import { ObjectViewString } from '#/viewer/ObjectViewString';

const shareMethods = ['canShare', 'share'] as const;
type ShareMethod = typeof shareMethods[number];
type ShareTextFieldName = 'title' | 'text' | 'url';

const textExamples: Record<ShareTextFieldName, string> = {
  title: 'Share data title',
  text: 'Share data text',
  url: 'https://example.com',
};

const textFields = ['title', 'text', 'url'] as const;

const RouteComponent: FC = () => {
  const { pathname } = useLocation();
  const [data, setData] = useState<ShareData>({});
  const [revision, setRevision] = useState(0);
  const hasData = Object.keys(data).length > 0;

  const setField = <Key extends keyof ShareData,>(name: Key, value: ShareData[Key]) => {
    setData((current) => {
      const next = { ...current };
      if (value === undefined) delete next[name];
      else next[name] = value;
      return next;
    });
    setRevision((current) => current + 1);
  };

  const evaluate = (method: ShareMethod) => {
    if (method === 'canShare') return hasData ? navigator.canShare(data) : navigator.canShare();
    return hasData ? navigator.share(data) : navigator.share();
  };

  return (
    <Stack gap={2}>
      <Stack direction="row" gap={2} flexWrap="wrap" alignItems="start">
        {textFields.map((name) => (
          <ShareTextField
            key={name}
            id={pathname}
            name={name}
            value={data[name]}
            onChange={(value) => setField(name, value)}
          />
        ))}
        <ShareFilesField files={data.files} onChange={(files) => setField('files', files)} />
      </Stack>

      {shareMethods.map((method) => (
        <ObjectViewerPanel
          key={`${method}/${revision}`}
          id={`${pathname}#${method}`}
          heading={<ShareHeading method={method} data={data} />}
          resource={lazy<boolean | void>(() => evaluate(method), `navigator.${method}()`)}
        />
      ))}
    </Stack>
  );
};

export const Route = createFileRoute('/navigator.share()')({
  component: RouteComponent,
});

type ShareTextFieldProps = {
  id: string;
  name: ShareTextFieldName;
  value: string | undefined;
  onChange: (value: string | undefined) => void;
};

const ShareTextField: FC<ShareTextFieldProps> = ({ id, name, value, onChange }) => (
  <Stack sx={{ flex: '1 1 16ch', minWidth: 0 }}>
    <FormControlLabel
      control={
        <Checkbox
          size="small"
          checked={value !== undefined}
          onChange={(_, checked) => onChange(checked ? textExamples[name] : undefined)}
        />
      }
      label={<code>{name}</code>}
    />
    {value !== undefined && (
      <TextField
        id={`${id}/${name}`}
        size="small"
        multiline={name === 'text'}
        label={<code>{name}</code>}
        value={value}
        onChange={(event) => onChange(event.target.value)}
      />
    )}
  </Stack>
);

type ShareFilesFieldProps = {
  files: File[] | undefined;
  onChange: (files: File[] | undefined) => void;
};

const ShareFilesField: FC<ShareFilesFieldProps> = ({ files, onChange }) => (
  <Stack gap={0.5} sx={{ flex: '1 1 24ch', minWidth: 0 }}>
    <FormControlLabel
      control={
        <Checkbox
          size="small"
          checked={files !== undefined}
          onChange={(_, checked) => onChange(checked ? [] : undefined)}
        />
      }
      label={<code>files</code>}
    />
    {files && (
      <>
        <Stack direction="row" gap={1} flexWrap="wrap">
          <Button component="label" size="small" variant="outlined">
            Choose files
            <Box
              component="input"
              type="file"
              multiple
              sx={{
                clipPath: 'inset(50%)',
                position: 'absolute',
                width: '1px',
                height: '1px',
                overflow: 'hidden',
              }}
              onChange={(event) => {
                const selected = Array.from(event.target.files ?? []);
                if (selected.length) onChange([...files, ...selected]);
                event.target.value = '';
              }}
            />
          </Button>
          <Button
            size="small"
            onClick={() => onChange([
              ...files,
              new File(['Example file content'], 'example.txt', { type: 'text/plain' }),
            ])}
          >
            Add example file
          </Button>
          {files.length > 0 && <Button size="small" onClick={() => onChange([])}>Clear files</Button>}
        </Stack>
        {files.length > 0 && (
          <Box component="ul" sx={{ my: 0, pl: 3 }}>
            {files.map((file, index) => (
              <li key={index}><ObjectViewString value={file.name} /></li>
            ))}
          </Box>
        )}
      </>
    )}
  </Stack>
);

type ShareHeadingProps = {
  method: ShareMethod;
  data: ShareData;
};

const ShareHeading: FC<ShareHeadingProps> = ({ method, data }) => (
  <ThemeProvider theme={codeTheme}>
    <Box
      component="code"
      sx={{
        display: 'block',
        overflowX: 'auto',
        whiteSpace: 'pre',
        fontFamily: 'monospace',
        fontSize: (theme) => theme.typography.body1.fontSize,
        lineHeight: 1.5,
        '& .method': { color: 'secondary.dark' },
        '& .property': { color: 'primary.dark' },
      }}
    >
      navigator.<span className="method">{method}</span>(
      {Object.keys(data).length === 0 ? null : (
        <>
          {'{\n'}
          {textFields.map((name) => {
            const value = data[name];
            return value === undefined ? null : (
              <span key={name}>
                {'  '}
                <span className="property">{name}</span>
                {': '}
                <ObjectViewString value={value} />
                <ObjectSymbol>,</ObjectSymbol>
                {'\n'}
              </span>
            );
          })}
          {data.files && (
            <>
              {'  '}
              <span className="property">files</span>
              {': '}
              <ObjectSymbol>{data.files.length ? 'selectedFiles' : '[]'},</ObjectSymbol>
              {'\n'}
            </>
          )}
          {'}'}
        </>
      )}
      {')'}
    </Box>
  </ThemeProvider>
);
