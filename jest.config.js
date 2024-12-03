module.exports = {
    collectCoverage: true, // Enable coverage collection
    collectCoverageFrom: [
      'utils/**/*.js', // Specify which files you want to collect coverage for
    ],
    coverageDirectory: 'coverage/backend', // Directory to save coverage reports
    coverageReporters: ['text', 'html'], // Coverage report formats
    testEnvironment: 'node', // For backend testing
    testMatch: [
      '**/jest/**/*Test.jest.js', // Match files in your jest folder with the pattern '*Test.jest.js'
      '**/test/**/*Test.jest.js', // Or any other folder where your Jest tests are located
    ],
  };
  