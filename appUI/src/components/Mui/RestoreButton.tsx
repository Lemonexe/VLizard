import { FC } from 'react';
import { Replay } from '@mui/icons-material';
import { DenseIconButton } from './DenseIconButton.tsx';

type RestoreButtonProps = { onClick: () => void };
export const RestoreButton: FC<RestoreButtonProps> = ({ onClick }) => (
    <DenseIconButton onClick={onClick} children={<Replay color="action" />} />
);
