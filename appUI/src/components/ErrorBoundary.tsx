import { Component, PropsWithChildren } from 'react';
import { ErrorAlert } from './ErrorAlert.tsx';

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
        if (this.state.error) return <ErrorAlert message={this.state.error.toString()} />;

        return this.props.children;
    }
}
