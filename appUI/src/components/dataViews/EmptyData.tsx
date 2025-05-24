import { Box } from '@mui/material';
import { FC, PropsWithChildren } from 'react';

export const EmptyData: FC<PropsWithChildren> = ({ children }) => (
    <Box p={2}>
        <p>No data to show.</p>
        <p>{children}</p>
    </Box>
);
