import { Close } from '@mui/icons-material';
import { DialogTitle, IconButton, Stack } from '@mui/material';
import { FC, PropsWithChildren } from 'react';

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
