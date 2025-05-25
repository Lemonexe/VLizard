import { Close } from '@mui/icons-material';
import { DialogTitle, IconButton, Stack, styled } from '@mui/material';
import { FC, PropsWithChildren } from 'react';

const ConstrainedStack = styled(Stack)(() => ({
    width: '100%',
    overflow: 'hidden',
}));
const ConstrainedSpan = styled('span')(() => ({
    overflow: 'hidden',
    textOverflow: 'ellipsis',
}));

type DialogTitleProps = PropsWithChildren<{
    handleClose: () => void;
}>;

export const DialogTitleWithX: FC<DialogTitleProps> = ({ children, handleClose }) => (
    <DialogTitle>
        <ConstrainedStack direction="row" justifyContent="space-between" alignItems="center">
            <ConstrainedSpan>{children}</ConstrainedSpan>
            <IconButton onClick={handleClose}>
                <Close color="action" />
            </IconButton>
        </ConstrainedStack>
    </DialogTitle>
);
