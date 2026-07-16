import React from 'react';

interface Props {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

interface State {
  hasError: boolean;
}

class ErrorBoundary extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(): State {
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    if (process.env.NODE_ENV === 'production') {
      // const throttledsplunkInstance = throttle(splunkInstance('error').sendEvent, 2000);
      // throttledsplunkInstance({
      //   group: 'frontend_error_logging',
      //   type: 'unhandled_exceptions_with_error_boundary',
      //   event: {
      //     error: {
      //       message: error.message,
      //       stack: error.stack,
      //       name: error.name,
      //     },
      //     errorInfo,
      //   },
      // });
    }
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback ?? null;
    }
    return this.props.children;
  }
}

export default ErrorBoundary;
