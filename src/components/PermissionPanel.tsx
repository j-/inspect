import BlockIcon from '@mui/icons-material/Block';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import { useMemo, useState, type FC } from 'react';
import { ObjectViewerPanel } from './ObjectViewerPanel';
import { reactive } from '#/resource';
import { ObjectViewString } from '#/viewer/ObjectViewString.tsx';

type PermissionPanelProps = {
  id: string;
  name: string;
};

const permissionIcons = {
  granted: CheckCircleOutlineIcon,
  prompt: HelpOutlineIcon,
  denied: BlockIcon,
};

export const PermissionPanel: FC<PermissionPanelProps> = ({ id, name }) => {
  const [state, setState] = useState<PermissionState>();

  const resource = useMemo(() => reactive(async () => {
    try {
      const status = await navigator.permissions.query({
        name: name as PermissionName,
      });
      setState(status.state);
      return status;
    } catch (error) {
      setState(undefined);
      throw error;
    }
  }, 'change'), [name]);

  const Icon = state ? permissionIcons[state] : null;

  return (
    <ObjectViewerPanel
      id={id}
      heading={
        <>
          {Icon && (
            <Icon
              fontSize="small"
              titleAccess={`Permission ${state}`}
              color={state === 'granted' ? 'success' : state === 'denied' ? 'error' : 'action'}
              sx={{ mr: 0.75, verticalAlign: 'middle' }}
            />
          )}
          <ObjectViewString value={name} /> permission
        </>
      }
      resource={resource}
    />
  );
};
