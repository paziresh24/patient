import { splunkInstance } from '@/common/services/splunk';
import throttle from 'lodash/throttle';
import React from 'react';

interface Props {
  children: React.ReactNode;
}

class ErrorBoundary extends React.Component<Props> {
  constructor(props: Props) {
    super(props);
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
    return this.props.children;
  }
}

export default ErrorBoundary;
