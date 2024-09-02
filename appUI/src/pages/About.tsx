import { FC } from 'react';
import { QuestionMark } from '@mui/icons-material';
import { Box, Button } from '@mui/material';
import { LICENSE_URL, MANUAL_URL, REPO_URL } from '../adapters/io/URL.ts';
import { DefaultLayout } from '../components/DefaultLayout.tsx';

const currentYear = new Date().getFullYear();

// display only major and minor version, not patch
const DisplayedAppVersion = APP_VERSION.split('.').slice(0, 2).join('.');

export const About: FC = () => (
    <DefaultLayout>
        <h1>VLizard v{DisplayedAppVersion}</h1>
        <Box my={2}>
            <Button startIcon={<QuestionMark />} href={MANUAL_URL} variant="outlined">
                User manual
            </Button>
        </Box>
        <p>Created by Jiří Zbytovský in 2023–{currentYear}.</p>
        <p>
            Hosted at <a href={REPO_URL}>Github repository</a> under the free <a href={LICENSE_URL}>MIT License</a>.
        </p>
    </DefaultLayout>
);
