module.exports = {
    transform: {
        "^.+\\.ts?(x)?": "ts-jest"
    },
    setupTestFrameworkScriptFile: "<rootDir>/jest.setup.js",
    verbose: false,
    moduleFileExtensions: ["ts", "js", "json"],
    testMatch: ["**/?(*.)+(spec|test).[tj]s?(x)"],
    env: "node"
}

