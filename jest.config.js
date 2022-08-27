module.exports = {
    verbose: true,
    testTimeout: 20000,
    setupFiles: ["dotenv/config"],
    transform: {
        "^.+\\.[t|j]sx?$": "babel-jest",
    },
};
