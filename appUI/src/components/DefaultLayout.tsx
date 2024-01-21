import { FC, PropsWithChildren } from 'react';
import { useNavigate } from 'react-router-dom';
import { AppBar, Box, Button, Toolbar, Tooltip } from '@mui/material';
import { HelpOutline, Home, Settings } from '@mui/icons-material';
import { spacingN } from '../contexts/MUITheme.tsx';
import { ContentContainer } from './Mui/ContentContainer.tsx';
import { DenseIconButton } from './Mui/DenseIconButton.tsx';
import { QueryRefreshButton } from './QueryRefreshButton.tsx';

export const DefaultLayout: FC<PropsWithChildren> = ({ children }) => {
    const navigate = useNavigate();

    return (
        <>
            <AppBar position="static">
                <Toolbar style={{ gap: spacingN(1) }}>
                    <Tooltip title="HOME">
                        <DenseIconButton onClick={() => navigate('/')} edge="start" color="inherit">
                            <Home />
                        </DenseIconButton>
                    </Tooltip>
                    <Button color="inherit" onClick={() => navigate('/compounds')}>
                        Pure Data
                    </Button>
                    <Button color="inherit" onClick={() => navigate('/systems')}>
                        Binary Data
                    </Button>
                    <Button color="inherit" onClick={() => navigate('/fitting')}>
                        Fitting
                    </Button>
                    <Box flexGrow={1} />
                    <QueryRefreshButton />
                    <Tooltip title="SETTINGS">
                        <DenseIconButton onClick={() => navigate('/settings')} color="inherit">
                            <Settings />
                        </DenseIconButton>
                    </Tooltip>
                    <Tooltip title="ABOUT">
                        <DenseIconButton onClick={() => navigate('/about')} edge="end" color="inherit">
                            <HelpOutline />
                        </DenseIconButton>
                    </Tooltip>
                </Toolbar>
            </AppBar>
            <ContentContainer>{children}</ContentContainer>
        </>
    );
};
