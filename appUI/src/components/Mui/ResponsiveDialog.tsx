import { FC } from 'react';
import { Dialog, DialogProps, useMediaQuery, useTheme } from '@mui/material';

export const ResponsiveDialog: FC<DialogProps> = ({ children, maxWidth, ...props }) => {
    const theme = useTheme();
    const isSizeSmall = useMediaQuery(theme.breakpoints.down(maxWidth || 'sm'));
    return (
        <Dialog fullScreen={isSizeSmall} maxWidth={maxWidth} {...props}>
            {children}
        </Dialog>
    );
};
