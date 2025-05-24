import { Replay } from '@mui/icons-material';
import { FC } from 'react';

import { DenseIconButton } from './DenseIconButton.tsx';

type RestoreButtonProps = { onClick: () => void };
export const RestoreButton: FC<RestoreButtonProps> = ({ onClick }) => (
    <DenseIconButton onClick={onClick} children={<Replay color="action" />} />
);
