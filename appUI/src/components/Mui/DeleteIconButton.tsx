import { FC } from 'react';
import { IconButton, Tooltip } from '@mui/material';
import { Delete } from '@mui/icons-material';

type DeleteIconButtonProps = {
    onClick: () => void;
};

export const DeleteIconButton: FC<DeleteIconButtonProps> = ({ onClick }) => (
    <Tooltip title="Delete">
        <IconButton onClick={onClick}>
            <Delete />
        </IconButton>
    </Tooltip>
);
