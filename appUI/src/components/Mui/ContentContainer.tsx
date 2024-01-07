import { FC, PropsWithChildren } from 'react';
import { Container } from '@mui/material';

export const ContentContainer: FC<PropsWithChildren> = ({ children }) => (
    <Container maxWidth="md" sx={{ py: 2 }}>
        {children}
    </Container>
);
