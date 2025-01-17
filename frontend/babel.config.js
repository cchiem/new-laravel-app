module.exports = function (api) {
    api.cache(true);
    return {
        presets: [
            ["babel-preset-expo", { jsxImportSource: "nativewind" }],
            "nativewind/babel",
        ],
        plugins: [
            "react-native-reanimated/plugin",
            [
                "module:react-native-dotenv",
                {
                    moduleName: "@env", // This will allow importing from @env
                    path: ".env", // Path to the .env file
                    safe: false, // Set to true if you want to use a safe .env file
                    allowUndefined: true, // This allows undefined variables in .env (can be useful in certain cases)
                },
            ],
        ],
    };
};
