import Box from '@mui/material/Box';
import { useRouter } from '@tanstack/react-router';
import { useMemo, type FC } from 'react';
import { AppLink } from './AppLink';

export const MenuConnected: FC = () => {
  const { routesById } = useRouter();

  const allPaths = useMemo(() => {
    const allRoutes = Object.values(routesById);
    const allPaths = new Set(allRoutes.map((route) => route.fullPath));
    return allPaths;
  }, [routesById]);

  return (
    <Box component="ul" sx={{ listStyleType: 'disc', pl: 2, m: 0 }}>
      {[...allPaths].map((path) => (
        <Box component="li" key={path}>
          <AppLink
            to={path}
            sx={{
              display: 'block',
              textDecoration: 'none',
              '&:hover': {
                backgroundColor: 'action.hover',
              },
              borderRadius: 1,
            }}
          >
            {path}
          </AppLink>
        </Box>
      ))}
    </Box>
  );
};
