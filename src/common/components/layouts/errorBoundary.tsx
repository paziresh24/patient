import React from 'react';
import Text from '@/common/components/atom/text/text';

interface Props {
  children: React.ReactNode;
}

interface State {
  hasError: boolean;
}

class ErrorBoundary extends React.Component<Props, State> {
  state: State = { hasError: false };

  static getDerivedStateFromError() {
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
      return (
        <div className="rounded-lg border border-slate-200 bg-slate-50 p-4 text-center">
          <Text fontSize="sm" className="text-slate-600">
            بارگذاری این بخش با خطا مواجه شد.
          </Text>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
