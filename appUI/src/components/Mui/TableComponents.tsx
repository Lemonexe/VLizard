import { TableCell, styled } from '@mui/material';

import { spacingN } from '../../contexts/MUITheme.tsx';

export const CollapsibleTableCell = styled(TableCell)({
    paddingTop: 0,
    paddingBottom: 0,
    paddingLeft: spacingN(3),
});

export const NoBorderCell = styled(TableCell)({ border: 'unset' });

export const DenseTableCell = styled(TableCell)({
    padding: spacingN(0.25),
    border: 'unset',
});
export const DenseTableHeadCell = styled(TableCell)({
    padding: spacingN(0.5),
    border: 'unset',
});
