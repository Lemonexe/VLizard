import { FC, useState } from 'react';
import { Tooltip } from '@mui/material';
import { Refresh } from '@mui/icons-material';
import { useInvalidateAllQueries } from '../adapters/api/helpers/useInvalidateAllQueries.ts';
import { DenseIconButton } from './Mui/DenseIconButton.tsx';

export const QueryRefreshButton: FC = () => {
    const invalidateAllQueries = useInvalidateAllQueries();

    const [rotation, setRotation] = useState(0);

    const handleClick = async () => {
        setRotation(rotation + 360);
        await invalidateAllQueries();
    };

    return (
        <Tooltip title="RELOAD PAGE, REFRESH DATA">
            <DenseIconButton onClick={handleClick} edge="start" color="inherit">
                <Refresh
                    style={{
                        transform: `rotate(${rotation}deg)`,
                        transition: 'transform 0.6s ease-out',
                    }}
                />
            </DenseIconButton>
        </Tooltip>
    );
};
