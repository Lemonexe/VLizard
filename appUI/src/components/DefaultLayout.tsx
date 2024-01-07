import { FC, PropsWithChildren } from 'react';
import { useNavigate } from 'react-router-dom';
import { AppBar, Box, Button, IconButton, styled, Toolbar, Tooltip } from '@mui/material';
import { HelpOutline, Home, Settings } from '@mui/icons-material';
import { ContentContainer } from './Mui/ContentContainer.tsx';

const DenseIconButton = styled(IconButton)(({ theme }) => ({
    padding: theme.spacing(0.5),
}));

export const DefaultLayout: FC<PropsWithChildren> = ({ children }) => {
    const navigate = useNavigate();

    return (
        <>
            <AppBar position="static">
                <Toolbar style={{ gap: 8 }}>
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
