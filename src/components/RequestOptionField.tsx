import MenuItem from '@mui/material/MenuItem';
import { ThemeProvider } from '@mui/material/styles';
import TextField from '@mui/material/TextField';
import type { ReactNode } from 'react';
import { codeTheme } from '#/theme';
import { ObjectViewUndefined } from '#/viewer/ObjectViewUndefined';

type RequestOptionFieldProps = {
  id: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  longestValue?: string;
  type?: 'number';
  disabled?: boolean;
  children?: ReactNode;
};

export function RequestOptionField({
  id,
  label,
  value,
  onChange,
  longestValue = 'undefined',
  type,
  disabled,
  children,
}: RequestOptionFieldProps) {
  const isNumber = type === 'number';
  const isUnset = value === (isNumber ? '' : 'undefined');
  // The outlined label floats at 75% size. Only widen the field when it needs that space.
  const width = `max(${longestValue.length}ch + 48px, ${label.length * 0.75}ch + 40px)`;

  return (
    <ThemeProvider theme={codeTheme}>
      <TextField
        id={id}
        label={<code>{label}</code>}
        size="small"
        select={!isNumber}
        type={type}
        placeholder={isNumber ? 'undefined' : undefined}
        slotProps={isNumber ? { inputLabel: { shrink: true } } : undefined}
        value={value}
        disabled={disabled}
        onChange={(event) => onChange(event.target.value)}
        sx={(theme) => ({
          fontFamily: 'monospace',
          fontSize: theme.typography.body1.fontSize,
          width,
          maxWidth: '100%',
          flexShrink: 0,
          '& .MuiSelect-select': { py: 0.5 },
          '& input.MuiInputBase-input': { py: 0.5, height: '1.5em', fontFamily: 'monospace' },
          '& input::placeholder': { color: 'text.secondary', opacity: 1 },
          ...(isUnset && {
            '& .MuiSelect-select .MuiTypography-root': { color: 'text.secondary' },
            '& .MuiInputLabel-root:not(.Mui-focused)': { color: 'text.secondary' },
            '& .MuiOutlinedInput-root:not(:hover):not(.Mui-focused) .MuiOutlinedInput-notchedOutline': {
              borderColor: 'divider',
            },
          }),
        })}
      >
        {!isNumber && <MenuItem value="undefined"><ObjectViewUndefined /></MenuItem>}
        {children}
      </TextField>
    </ThemeProvider>
  );
}
