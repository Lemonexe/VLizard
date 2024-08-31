import { FC } from 'react';
import { QuestionMark } from '@mui/icons-material';
import { Box, Button } from '@mui/material';
import { DefaultLayout } from '../components/DefaultLayout.tsx';

const currentYear = new Date().getFullYear();

// display only major and minor version, not patch
const DisplayedAppVersion = APP_VERSION.split('.').slice(0, 2).join('.');

export const About: FC = () => (
    <DefaultLayout>
        <h1>VLizard v{DisplayedAppVersion}</h1>
        <Box my={2}>
            <Button
                startIcon={<QuestionMark />}
                href="https://github.com/Lemonexe/VLizard/blob/master/docs/user/manual.md"
                variant="outlined"
            >
                User manual
            </Button>
        </Box>
        <p>Created by Jiří Zbytovský in 2023–{currentYear}.</p>
        <p>
            Hosted at <a href="https://github.com/Lemonexe/VLizard/">Github repository</a> under the free{' '}
            <a href="https://github.com/Lemonexe/VLizard/blob/master/LICENSE">MIT License</a>.
        </p>
    </DefaultLayout>
);
