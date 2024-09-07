import { Dispatch, FC, SetStateAction } from 'react';
import { IconButton } from '@mui/material';
import { HelpOutline, KeyboardArrowDown, KeyboardArrowUp } from '@mui/icons-material';

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
