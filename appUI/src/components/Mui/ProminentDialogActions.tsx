import { DialogActions, styled } from '@mui/material';
import { spacingN } from '../../contexts/MUITheme.tsx';

export const ProminentDialogActions = styled(DialogActions)({
    paddingTop: spacingN(1),
    borderTop: '1px solid #ddd',
});
