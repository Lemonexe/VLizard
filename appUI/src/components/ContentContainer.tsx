import { FC, PropsWithChildren } from 'react';
import { Container } from '@mui/material';

export const ContentContainer: FC<PropsWithChildren> = ({ children }) => (
    <>
        <Container maxWidth="lg" sx={{ py: 2 }}>
            {children}
        </Container>
    </>
);
