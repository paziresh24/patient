import { getWebInstrumentations, initializeFaro, faro, LogLevel } from '@grafana/faro-web-sdk';
import { TracingInstrumentation } from '@grafana/faro-web-tracing';
import getConfig from 'next/config';

export const initFaro = () => {
  const { publicRuntimeConfig } = getConfig?.() || {};
  const faroUrl =
    publicRuntimeConfig?.NEXT_PUBLIC_GRAFANA_FARO_URL || process.env.NEXT_PUBLIC_GRAFANA_FARO_URL;
  const faroApp = publicRuntimeConfig?.NEXT_PUBLIC_GRAFANA_FARO_APP || process.env.NEXT_PUBLIC_GRAFANA_FARO_APP;
  const faroNamespace =
    publicRuntimeConfig?.NEXT_PUBLIC_FARO_APP_NAMESPACE || process.env.NEXT_PUBLIC_FARO_APP_NAMESPACE;

  if (typeof window === 'undefined' || !faroUrl) {
    console.log('Faro initialization skipped:', {
      isServer: typeof window === 'undefined',
      hasFaroUrl: !!faroUrl,
      faroUrl,
    });
    return;
  }

  // Skip if already initialized
  if (faro.api) {
    console.log('Faro already initialized');
    return;
  }

  console.log('Initializing Faro with URL:', faroUrl);

  try {
    // Configure tracing instrumentation
    const tracingInstrumentation = new TracingInstrumentation({
      // Add any specific tracing configuration here if needed
    });

    // Set up base configuration
    const config = {
      url: faroUrl,
      app: {
        name: faroApp || 'patient',
        version: process.env.npm_package_version || '0.0.0',
        namespace: faroNamespace || 'patient',
      },
      instrumentations: [
        ...getWebInstrumentations({
          captureConsole: true,
          captureConsoleDisabledLevels: [LogLevel.DEBUG, LogLevel.INFO],
        }),
        tracingInstrumentation,
      ],
      // Move context attributes to user object or session attributes
      sessionTracking: {
        enabled: true,
      },
      // Add custom attributes via user or session
      user: {
        attributes: {
          environment: process.env.NODE_ENV || 'development',
          platform: 'web',
        },
      },
    };

    // Initialize Faro
    const faroInstance = initializeFaro(config);

    // Custom sampling logic - this should be done differently
    // The transports configuration structure you used is not correct
    // Instead, you can configure sampling at the instrumentation level

    console.log('Faro initialized successfully with config:', {
      url: config.url,
      app: config.app,
      instrumentationsCount: config.instrumentations.length,
      environment: process.env.NODE_ENV,
    });

    return faroInstance;
  } catch (error) {
    console.error('Failed to initialize Faro:', error);
    // Don't throw the error to prevent breaking the application
    return null;
  }
};

// Optional: Function to add custom sampling logic after initialization
export const setupFaroSampling = () => {
  if (!faro.api) {
    console.warn('Faro not initialized, cannot setup sampling');
    return;
  }

  // You can add custom logic here to sample traces/spans
  // This would typically be done through the tracing instrumentation configuration
  // or by using Faro's API to filter events before they're sent
};
