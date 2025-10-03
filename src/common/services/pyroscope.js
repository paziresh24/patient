const { init, start } = require('@pyroscope/nodejs');

const initPyroscope = () => {
  if (typeof window !== 'undefined') return; // Only run on server-side

  init({
    serverAddress: process.env.PYROSCOPE_SERVER_ADDRESS,
    appName: process.env.PYROSCOPE_APPLICATION_NAME || 'patient-frontend',
    tags: {
      environment: process.env.NODE_ENV || 'development',
    },
    basicAuthUser: process.env.PYROSCOPE_BASIC_AUTH_USER,
    basicAuthPassword: process.env.PYROSCOPE_BASIC_AUTH_PASSWORD,
    // Enable CPU profiling
    wall: {
      collectCpuTime: process.env.PYROSCOPE_WALL_COLLECT_CPU_TIME === 'true',
      samplingDurationMs: parseInt(process.env.PYROSCOPE_WALL_SAMPLING_DURATION_MS || '60000'),
      samplingIntervalMicros: parseInt(process.env.PYROSCOPE_WALL_SAMPLING_INTERVAL_MICROS || '10000'),
    },
  });

  start();
  console.log('Pyroscope initialized with server:', process.env.PYROSCOPE_SERVER_ADDRESS);
};

module.exports = { initPyroscope };

