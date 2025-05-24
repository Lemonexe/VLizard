import { Delete } from '@mui/icons-material';
import { IconButton, Tooltip } from '@mui/material';
import { FC } from 'react';

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
