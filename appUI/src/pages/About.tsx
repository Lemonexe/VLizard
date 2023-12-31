import { FC } from 'react';
import { QuestionMark } from '@mui/icons-material';
import { Box, Button } from '@mui/material';

export const About: FC = () => (
    <>
        <h1>VLizard v{APP_VERSION}</h1>
        <Box my={2}>
            <Button
                startIcon={<QuestionMark />}
                href="https://github.com/Lemonexe/VLizard/blob/master/docs/user/manual.md"
                variant="outlined"
            >
                User manual
            </Button>
        </Box>
        <p>
            Created by Jiří Zbytovský in 2023, hosted at{' '}
            <a href="https://github.com/Lemonexe/VLizard/">Github repository</a> under the free{' '}
            <a href="https://github.com/Lemonexe/VLizard/blob/master/LICENSE">MIT License</a>.
        </p>
    </>
);
