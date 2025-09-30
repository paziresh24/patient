import * as Sentry from '@sentry/nextjs';
import Error from 'next/error';
import { trace, SpanStatusCode } from '@opentelemetry/api';

const CustomErrorComponent = (props: any) => {
  return <Error statusCode={props.statusCode} />;
};

CustomErrorComponent.getInitialProps = async (contextData: any) => {
  const tracer = trace.getTracer('patient-frontend.error-handler');
  const span = tracer.startSpan('error.page');

  try {
    // Get error details
    const statusCode = contextData.res?.statusCode ?? contextData.err?.statusCode ?? 500;
    const errorMessage = contextData.err?.message ?? 'Unknown server error';

    // Add error details to span
    span.setAttributes({
      'error.type': 'ServerError',
      'error.status_code': statusCode,
      'error.message': errorMessage,
      'service.name': 'patient-frontend',
      'error.stack': contextData.err?.stack ?? '',
      'error.code': contextData.err?.code ?? '',
      'page.path': contextData.asPath ?? '',
    });

    // For 5xx errors, mark as error in OpenTelemetry
    if (statusCode >= 500) {
      span.setStatus({
        code: SpanStatusCode.ERROR,
        message: `Server error: ${statusCode} - ${errorMessage}`,
      });
    }

    // Send to Sentry for additional error tracking
    await Sentry.captureUnderscoreErrorException(contextData);

    // Get the standard error props
    const errorProps = await Error.getInitialProps(contextData);

    return {
      ...errorProps,
      hasError: true,
      statusCode,
      errorMessage,
    };
  } catch (error) {
    // Handle errors in error handling
    span.setStatus({
      code: SpanStatusCode.ERROR,
      message: `Error in error handling: ${error}`,
    });
    throw error;
  } finally {
    span.end();
  }
};

export default CustomErrorComponent;

