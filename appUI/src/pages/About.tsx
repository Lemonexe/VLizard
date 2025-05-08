import { FC } from 'react';
import { QuestionMark } from '@mui/icons-material';
import { Button, Stack } from '@mui/material';
import { LICENSE_URL, MANUAL_URL, REPO_URL } from '../adapters/io/URL.ts';
import { trimPatchVersion } from '../adapters/semver.ts';
import { DefaultLayout } from '../components/DefaultLayout.tsx';
import { UpdateAvailableButton } from '../components/AppUpdate/UpdateAvailableButton.tsx';

const currentYear = new Date().getFullYear();

export const About: FC = () => (
    <DefaultLayout>
        <h1>VLizard v{trimPatchVersion(APP_VERSION)}</h1>
        <Stack direction="row" my={2} spacing={2}>
            <UpdateAvailableButton />
            <Button startIcon={<QuestionMark />} href={MANUAL_URL} variant="outlined">
                Getting started
            </Button>
        </Stack>
        <p>Created by Jiří Zbytovský in 2023–{currentYear}.</p>
        <p>
            Hosted at <a href={REPO_URL}>Github repository</a> under the free <a href={LICENSE_URL}>MIT License</a>.
        </p>
    </DefaultLayout>
);
