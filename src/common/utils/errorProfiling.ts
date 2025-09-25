import { wrapWithLabels } from '@pyroscope/nodejs';

export const withErrorProfiling = async <T>(fn: () => Promise<T> | T, context: string = 'unknown'): Promise<T> => {
  try {
    let result: T | undefined;
    await wrapWithLabels(
      {
        profileType: 'normal',
        context,
      },
      async () => {
        result = await Promise.resolve(fn());
      },
    );
    if (result === undefined) {
      throw new Error('Function execution failed to produce a result');
    }
    return result;
  } catch (error: any) {
    // Type assertion for error
    // Profile the error handling with specific labels
    await wrapWithLabels(
      {
        profileType: 'error',
        context,
        errorType: error?.name || 'UnknownError',
        errorMessage: error?.message || 'Unknown error occurred',
      },
      async () => {
        // Just profile the error, don't return anything meaningful
        await Promise.resolve();
      },
    );
    throw error; // Re-throw the error after profiling
  }
};

