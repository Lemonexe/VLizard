import { FC, PropsWithChildren } from 'react';
import { useNavigate } from 'react-router-dom';
import { AppBar, Box, Button, IconButton, Toolbar, Tooltip } from '@mui/material';
import { HelpOutline, Home, Settings } from '@mui/icons-material';
import { ContentContainer } from './ContentContainer.tsx';

export const DefaultLayout: FC<PropsWithChildren> = ({ children }) => {
    const navigate = useNavigate();

    return (
        <>
            <AppBar position="static">
                <Toolbar>
                    <Tooltip title="HOME">
                        <IconButton onClick={() => navigate('/')} edge="start" color="inherit">
                            <Home />
                        </IconButton>
                    </Tooltip>
                    <Button color="inherit" onClick={() => navigate('/data')}>
                        Data
                    </Button>
                    <Button color="inherit" onClick={() => navigate('/analysis')}>
                        Analysis
                    </Button>
                    <Button color="inherit" onClick={() => navigate('/fitting')}>
                        Fitting
                    </Button>
                    <Box flexGrow={1} />
                    <Tooltip title="SETTINGS">
                        <IconButton onClick={() => navigate('/settings')} color="inherit">
                            <Settings />
                        </IconButton>
                    </Tooltip>
                    <Tooltip title="ABOUT">
                        <IconButton onClick={() => navigate('/about')} edge="end" color="inherit">
                            <HelpOutline />
                        </IconButton>
                    </Tooltip>
                </Toolbar>
            </AppBar>
            <ContentContainer>{children}</ContentContainer>
        </>
    );
};
