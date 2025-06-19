const nextJest = require('next/jest');

const createJestConfig = nextJest({
  // Provide the path to your Next.js app to load next.config.js and .env files in your test environment
  dir: './',
});

// Add any custom config to be passed to Jest
const customJestConfig = {
  // Add more setup options before each test is run
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
  // if using TypeScript with a baseUrl set to the root directory then you need the below for alias' to work
  moduleNameMapper: {
    '^@/modules/(.*)$': '<rootDir>/src/modules/$1',
    '^@/common/(.*)$': '<rootDir>/src/common/$1',
    '^@/types/(.*)$': '<rootDir>/src/common/types/$1',
    '^@/components/(.*)$': '<rootDir>/src/common/components/$1',
    '^@/utils/(.*)$': '<rootDir>/src/common/utils/$1',
    '^@/images/(.*)$': '<rootDir>/src/common/images/$1',
    '^@/constants/(.*)$': '<rootDir>/src/common/constants/$1',
    '^@/hooks/(.*)$': '<rootDir>/src/common/hooks/$1',
    '^@/store/(.*)$': '<rootDir>/src/common/store/$1',
    '^@/apis/(.*)$': '<rootDir>/src/common/apis/$1',
  },
  moduleDirectories: ['node_modules', '<rootDir>/'],
  testEnvironment: 'jest-environment-jsdom',
};

// createJestConfig is exported this way to ensure that next/jest can load the Next.js config which is async
module.exports = createJestConfig(customJestConfig);
