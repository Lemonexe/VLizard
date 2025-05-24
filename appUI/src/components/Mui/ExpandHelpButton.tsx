import { HelpOutline, KeyboardArrowDown, KeyboardArrowUp } from '@mui/icons-material';
import { IconButton } from '@mui/material';
import { Dispatch, FC, SetStateAction } from 'react';

export type ExpandHelpButtonProps = {
    infoOpen: boolean;
    setInfoOpen: Dispatch<SetStateAction<boolean>>;
};

export const ExpandHelpButton: FC<ExpandHelpButtonProps> = ({ infoOpen, setInfoOpen }) => (
    <IconButton onClick={() => setInfoOpen((prev) => !prev)}>
        <HelpOutline />
        {infoOpen ? <KeyboardArrowUp /> : <KeyboardArrowDown />}
    </IconButton>
);
