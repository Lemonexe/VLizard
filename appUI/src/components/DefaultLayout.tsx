import { FC, PropsWithChildren } from 'react';
import { AppBar, Box, Button, IconButton, Toolbar, Tooltip } from '@mui/material';
import { HelpOutline, Home, Settings } from '@mui/icons-material';
import { ContentContainer } from './ContentContainer.tsx';

export const DefaultLayout: FC<PropsWithChildren> = ({ children }) => (
    <>
        <AppBar position="static">
            <Toolbar>
                <Tooltip title="HOME">
                    <IconButton href="/" edge="start" color="inherit">
                        <Home />
                    </IconButton>
                </Tooltip>
                <Button color="inherit" href="data">
                    Data
                </Button>
                <Button color="inherit" href="analysis">
                    Analysis
                </Button>
                <Button color="inherit" href="fitting">
                    Fitting
                </Button>
                <Box flexGrow={1} />
                <Tooltip title="SETTINGS">
                    <IconButton href="settings" color="inherit">
                        <Settings />
                    </IconButton>
                </Tooltip>
                <Tooltip title="ABOUT">
                    <IconButton href="about" edge="end" color="inherit">
                        <HelpOutline />
                    </IconButton>
                </Tooltip>
            </Toolbar>
        </AppBar>
        <ContentContainer>{children}</ContentContainer>
    </>
);
