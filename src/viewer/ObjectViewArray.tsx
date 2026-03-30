import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { memo, type ReactNode } from 'react';
import { ObjectLabel } from './ObjectLabel';
import { getArrayName } from './utils';

export const ObjectViewArray = memo<{
  value: unknown[];
  renderValue: (value: unknown, index: number) => ReactNode;
}>(({ value, renderValue }) => {
  if (value.length === 0) {
    return (
      <>
        <ObjectLabel>
          {getArrayName(value)}
        </ObjectLabel>

        {' '}

        <Typography component="span" color="gray.300" fontFamily="monospace">
          {'[]'}
        </Typography>
      </>
    );
  }

  return (
    <>
      <ObjectLabel>
        {getArrayName(value)}
      </ObjectLabel>

      {' '}

      <Typography component="span" color="gray.300" fontFamily="monospace">
        {'['}
      </Typography>

      <Box component="ul" p={0} m={0} ml="2ch">
        {value.map((item, i, arr) => [
          <Box
            key={i}
            component="li"
            display="inline"
            value={i}
            sx={{ listStyle: 'none' }}
          >
            {renderValue(item, i)}
          </Box>,

          i < arr.length - 1 ? (
            <Typography
              key={i + ','}
              component="span"
              color="gray.300"
              fontFamily="monospace"
            >
              {', '}
            </Typography>
          ) : null,
        ])}
      </Box>

      <Typography component="span" color="gray.300" fontFamily="monospace">
        {']'}
      </Typography>
    </>
  );
});
