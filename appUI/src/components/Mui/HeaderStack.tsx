import { FC, PropsWithChildren } from 'react';
import { Stack } from '@mui/material';

export const HeaderStack: FC<PropsWithChildren> = ({ children }) => (
    <Stack direction="row" justifyContent="space-between" mt={1} mb={2}>
        {children}
    </Stack>
);
