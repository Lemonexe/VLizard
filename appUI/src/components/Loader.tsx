import { FC } from 'react';
import { Dialog, DialogContent, styled } from '@mui/material';
import { Loop } from '@mui/icons-material';

const Jumper = styled('span')({
    display: 'inline-block',
    paddingLeft: '0.1em',
    animation: 'jump 1.2s ease-in-out infinite',
    '@keyframes jump': {
        '0%,66%,100%': { transform: 'translateY(0)' },
        '33%': { transform: 'translateY(-0.25em)' },
    },
});

type JumperDotProps = { delay: number };
const JumperDot: FC<JumperDotProps> = ({ delay }) => <Jumper style={{ animationDelay: `${delay}ms` }} children="." />;

export const Spinner = styled(Loop)({
    animation: 'spin 2s linear infinite',
    '@keyframes spin': {
        from: { transform: 'rotate(0deg)' },
        to: { transform: 'rotate(360deg)' },
    },
});

export const Loader: FC = () => (
    <span style={{ color: '#777' }}>
        <Spinner style={{ verticalAlign: 'middle' }} />
        &nbsp;Loading
        <JumperDot delay={0} />
        <JumperDot delay={100} />
        <JumperDot delay={200} />
    </span>
);

export const LoadingDialog: FC = () => (
    <Dialog open={true} fullWidth maxWidth="xs">
        <DialogContent sx={{ p: 6, textAlign: 'center', fontSize: '1.5rem' }}>
            <Loader />
        </DialogContent>
    </Dialog>
);
