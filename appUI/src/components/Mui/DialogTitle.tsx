import { FC, PropsWithChildren } from 'react';
import { DialogTitle, IconButton, Stack } from '@mui/material';
import { Close } from '@mui/icons-material';

type DialogTitleProps = PropsWithChildren<{
    handleClose: () => void;
}>;

export const DialogTitleWithX: FC<DialogTitleProps> = ({ children, handleClose }) => (
    <DialogTitle>
        <Stack direction="row" justifyContent="space-between" alignItems="center">
            <span>{children}</span>
            <IconButton onClick={handleClose}>
                <Close color="action" />
            </IconButton>
        </Stack>
    </DialogTitle>
);
