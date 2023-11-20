import { Component, PropsWithChildren } from 'react';
import { Alert, Typography } from '@mui/material';

interface ErrorBoundaryState {
    error: unknown;
}

export class ErrorBoundary extends Component<PropsWithChildren, ErrorBoundaryState> {
    constructor(props: PropsWithChildren) {
        super(props);
        this.state = { error: null };
    }

    static getDerivedStateFromError(error: unknown) {
        return { error };
    }

    render() {
        if (this.state.error)
            return (
                <>
                    <Alert severity="error" sx={{ mb: 2 }}>
                        Oops! Something went wrong.
                    </Alert>
                    <Typography variant="subtitle2">Debug info:</Typography>
                    <code>{this.state.error.toString()}</code>
                </>
            );

        return this.props.children;
    }
}
