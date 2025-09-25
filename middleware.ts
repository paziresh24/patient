import { NextRequest, NextResponse } from 'next/server';
import { trace, SpanStatusCode, context } from '@opentelemetry/api';

export async function middleware(request: NextRequest) {
  const tracer = trace.getTracer('patient-frontend.middleware');

  // Start a new span for each request
  const span = tracer.startSpan('http.server.request');

  try {
    // Add request details to span
    span.setAttributes({
      'http.method': request.method,
      'http.url': request.url,
      'http.target': request.nextUrl.pathname,
      'http.user_agent': request.headers.get('user-agent') || '',
      'http.request_id': request.headers.get('x-request-id') || '',
      'service.name': 'patient-frontend',
    });

    // Execute the request within the span context
    const response = await context.with(trace.setSpan(context.active(), span), async () => {
      const response = NextResponse.next();

      // Add the traceparent to server-timing header
      response.headers.set('server-timing', `traceparent;desc="00-${span.spanContext().traceId}-${span.spanContext().spanId}-01"`);

      return response;
    });

    // Add response status to span
    const statusCode = response.status;
    span.setAttributes({
      'http.status_code': statusCode,
    });

    // Mark 5xx errors in span
    if (statusCode >= 500) {
      span.setStatus({
        code: SpanStatusCode.ERROR,
        message: `Server error: ${statusCode}`,
      });
    }

    return response;
  } catch (error: any) {
    // Handle and track any errors in middleware
    span.setStatus({
      code: SpanStatusCode.ERROR,
      message: error.message || 'Middleware error',
    });
    span.setAttributes({
      'error.type': error.name || 'UnknownError',
      'error.message': error.message || 'Unknown error occurred',
      'error.stack': error.stack || '',
    });
    throw error;
  } finally {
    span.end();
  }
}

