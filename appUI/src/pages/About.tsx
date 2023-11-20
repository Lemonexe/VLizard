import { FC } from 'react';
import { QuestionMark } from '@mui/icons-material';
import { Button, Typography } from '@mui/material';

export const About: FC = () => (
    <>
        <Typography variant="h1" pb={2}>
            VLizard v{APP_VERSION}
        </Typography>
        <Typography paragraph>
            <Button
                startIcon={<QuestionMark />}
                href="https://github.com/Lemonexe/VLizard/blob/master/docs/user/manual.md"
                variant="contained"
            >
                User manual
            </Button>
        </Typography>
        <Typography paragraph>
            Created by Jiří Zbytovský in 2023, hosted at{' '}
            <a href="https://github.com/Lemonexe/VLizard/">Github repository</a> under the free{' '}
            <a href="https://github.com/Lemonexe/VLizard/blob/master/LICENSE">MIT License</a>.
        </Typography>
    </>
);
