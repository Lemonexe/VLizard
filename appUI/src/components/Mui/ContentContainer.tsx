import { Container } from '@mui/material';
import { FC, PropsWithChildren } from 'react';

export const ContentContainer: FC<PropsWithChildren> = ({ children }) => (
    <Container maxWidth="md" sx={{ py: 2 }}>
        {children}
    </Container>
);
