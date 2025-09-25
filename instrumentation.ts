import { registerOTel } from '@vercel/otel';
import { metrics, trace, SpanStatusCode } from '@opentelemetry/api';

/**
 * Main registration function using @vercel/otel
 * Following Next.js official recommendations
 */
export function register() {
  try {
    console.log('Initializing OpenTelemetry with @vercel/otel...');

    // Simple and recommended configuration by Next.js docs
    registerOTel({
      serviceName: process.env.OTEL_SERVICE_NAME || 'patient-frontend',
      // Let @vercel/otel handle all the complex configuration
      // It will automatically configure the best exporters for the environment
    });

    console.log('✓ OpenTelemetry initialized successfully');

    // Log configuration
    console.log('OpenTelemetry configured with:', {
      serviceName: process.env.OTEL_SERVICE_NAME || 'patient-frontend',
      environment: process.env.NODE_ENV || 'development',
      endpoint: process.env.OTEL_EXPORTER_OTLP_ENDPOINT || 'auto-detected by @vercel/otel',
    });

    return { success: true };
  } catch (error) {
    console.error('Failed to initialize OpenTelemetry:', error);
    // Don't throw to prevent app crashes
    return { success: false, error };
  }
}

/**
 * Create utility functions for custom metrics
 * Using the global metrics API
 */
export function createCustomMetrics() {
  const meter = metrics.getMeter(process.env.OTEL_SERVICE_NAME || 'patient-frontend', process.env.npm_package_version || '0.0.0');

  const httpRequestsTotal = meter.createCounter('http_requests_total', {
    description: 'Total number of HTTP requests',
    unit: '1',
  });

  const httpRequestDuration = meter.createHistogram('http_request_duration_seconds', {
    description: 'Duration of HTTP requests in seconds',
    unit: 's',
  });

  const activeConnections = meter.createUpDownCounter('active_connections', {
    description: 'Number of active connections',
    unit: '1',
  });

  const pageViews = meter.createCounter('page_views_total', {
    description: 'Total number of page views',
    unit: '1',
  });

  const userActions = meter.createCounter('user_actions_total', {
    description: 'Total number of user actions',
    unit: '1',
  });

  const apiErrors = meter.createCounter('api_errors_total', {
    description: 'Total number of API errors',
    unit: '1',
  });

  return {
    httpRequestsTotal,
    httpRequestDuration,
    activeConnections,
    pageViews,
    userActions,
    apiErrors,

    // Helper function to record HTTP request metrics
    recordHttpRequest: (method: string, status_code: number, duration: number, route?: string) => {
      const attributes = {
        method,
        status_code: status_code.toString(),
        route: route || 'unknown',
        environment: process.env.NODE_ENV || 'development',
      };

      httpRequestsTotal.add(1, attributes);
      httpRequestDuration.record(duration, attributes);

      // Record errors separately
      if (status_code >= 400) {
        apiErrors.add(1, {
          ...attributes,
          error_type: status_code >= 500 ? 'server_error' : 'client_error',
        });
      }
    },

    // Helper function to record page view
    recordPageView: (page: string, user_agent?: string) => {
      pageViews.add(1, {
        page,
        user_agent: user_agent || 'unknown',
        environment: process.env.NODE_ENV || 'development',
      });
    },

    // Helper function to record user action
    recordUserAction: (action: string, component?: string) => {
      userActions.add(1, {
        action,
        component: component || 'unknown',
        environment: process.env.NODE_ENV || 'development',
      });
    },

    // Helper function to track active connections
    incrementActiveConnections: () => {
      activeConnections.add(1, {
        environment: process.env.NODE_ENV || 'development',
      });
    },

    decrementActiveConnections: () => {
      activeConnections.add(-1, {
        environment: process.env.NODE_ENV || 'development',
      });
    },
  };
}

/**
 * Utility functions for custom spans
 * Following Next.js examples from the documentation
 */
export const spanUtils = {
  /**
   * Create a custom span for async operations
   * Based on Next.js documentation example
   */
  withSpan: async <T>(
    name: string,
    operation: (span: any) => Promise<T> | T,
    attributes?: Record<string, string | number | boolean>,
  ): Promise<T> => {
    const tracer = trace.getTracer(process.env.OTEL_SERVICE_NAME || 'patient-frontend', process.env.npm_package_version || '0.0.0');

    return await tracer.startActiveSpan(name, async span => {
      try {
        // Add custom attributes if provided
        if (attributes) {
          span.setAttributes(attributes);
        }

        // Add standard attributes
        span.setAttributes({
          'service.name': process.env.OTEL_SERVICE_NAME || 'patient-frontend',
          'service.version': process.env.npm_package_version || '0.0.0',
          'environment': process.env.NODE_ENV || 'development',
        });

        const result = await operation(span);
        span.setStatus({ code: SpanStatusCode.OK });
        return result;
      } catch (error) {
        span.recordException(error as Error);
        span.setStatus({
          code: SpanStatusCode.ERROR,
          message: error instanceof Error ? error.message : 'Unknown error',
        });
        throw error;
      } finally {
        span.end();
      }
    });
  },

  /**
   * Create a custom span for API calls
   */
  withApiSpan: async <T>(method: string, url: string, operation: (span: any) => Promise<T>): Promise<T> => {
    return spanUtils.withSpan(`${method} ${url}`, operation, {
      'http.method': method,
      'http.url': url,
      'span.kind': 'client',
    });
  },

  /**
   * Create a custom span for database operations
   */
  withDbSpan: async <T>(operation: string, table?: string, fn?: (span: any) => Promise<T>): Promise<T> => {
    const spanName = table ? `${operation} ${table}` : operation;

    return spanUtils.withSpan(spanName, fn || (() => Promise.resolve({} as T)), {
      'db.operation': operation,
      ...(table && { 'db.table': table }),
      'span.kind': 'client',
    });
  },
};

// Export metrics instance for use in application code
export const customMetrics = createCustomMetrics();

/**
 * Middleware helper for Next.js API routes
 * Automatically tracks API performance
 */
export const withOtelMiddleware = (handler: any) => {
  return async (req: any, res: any) => {
    const startTime = Date.now();

    try {
      const result = await spanUtils.withSpan(`API ${req.method} ${req.url}`, async span => {
        span.setAttributes({
          'http.method': req.method,
          'http.url': req.url,
          'http.user_agent': req.headers['user-agent'] || 'unknown',
          'span.kind': 'server',
        });

        return await handler(req, res);
      });

      // Record metrics
      const duration = (Date.now() - startTime) / 1000;
      customMetrics.recordHttpRequest(req.method, res.statusCode, duration, req.url);

      return result;
    } catch (error) {
      const duration = (Date.now() - startTime) / 1000;
      customMetrics.recordHttpRequest(req.method, 500, duration, req.url);
      throw error;
    }
  };
};

