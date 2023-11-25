module.exports = {
    clearMocks: true,
    collectCoverageFrom: ['src/**/*.js'],
    coverageDirectiry: 'coverage',
    moduleFileExtansions: ['js'],
    testMatch: ['**/__tests__/**/*.js?(x)', '**/?(*.)+(spec|test).js?(x)'],
    testPathIgnorePatterns: ['\\\\node_modules\\\\'],
    transformIgnorePatterns: ['<rootDir>/node_modules/'],
    transforms: {
        '.+\\.(css|styl|less|sass|scss|png|jpg|ttf|woff|woff2)$':
        'jest-transform-stub',
        '^.+\\.(js|jsx)?$': 'babel-jest'
    },
    // verbose: false,
};