import { FC } from 'react';
import { QuestionMark } from '@mui/icons-material';
import { Button } from '@mui/material';

export const About: FC = () => (
    <>
        <h1>VLizard v{APP_VERSION}</h1>
        <p>
            <Button
                startIcon={<QuestionMark />}
                href="https://github.com/Lemonexe/VLizard/blob/master/docs/user/manual.md"
                variant="contained"
            >
                User manual
            </Button>
        </p>
        <p>
            Created by Jiří Zbytovský in 2023, hosted at{' '}
            <a href="https://github.com/Lemonexe/VLizard/">Github repository</a> under the free{' '}
            <a href="https://github.com/Lemonexe/VLizard/blob/master/LICENSE">MIT License</a>.
        </p>
    </>
);
