import { Stack } from '@mui/material';
import { FC, PropsWithChildren } from 'react';

export const HeaderStack: FC<PropsWithChildren> = ({ children }) => (
    <Stack direction="row" sx={{ justifyContent: 'space-between', mt: 1, mb: 2 }}>
        {children}
    </Stack>
);
