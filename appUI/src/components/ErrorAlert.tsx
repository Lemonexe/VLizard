import { FC } from 'react';
import { Alert, Box, Button } from '@mui/material';
import { Loop } from '@mui/icons-material';
import { ContentContainer } from './ContentContainer.tsx';

interface ErrorAlertProps {
    message: string;
}

const pageReload = () => window.location.reload();

export const ErrorAlert: FC<ErrorAlertProps> = ({ message }) => (
    <ContentContainer>
        <Alert severity="error" sx={{ my: 2 }}>
            Oops! Something went wrong.
        </Alert>
        <Box mx={1}>
            <Box my={6}>
                <b>Cause:</b> {message}
            </Box>
            <p>
                You may try to{' '}
                <Button endIcon={<Loop />} onClick={pageReload} variant="text">
                    Reload the page
                </Button>
                <br />
                In case the error persists, please report it to the{' '}
                <a href="https://github.com/Lemonexe/VLizard/blob/master/docs/user/bug_tracking.md">app maintainer</a>.
            </p>
        </Box>
    </ContentContainer>
);
