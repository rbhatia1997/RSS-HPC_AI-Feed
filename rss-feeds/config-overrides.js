// config-overrides.js
const { override } = require('react-app-rewired');

module.exports = override(
  function(config, env) {
    // Add polyfills for missing Node.js modules
    config.resolve.fallback = {
      ...config.resolve.fallback,
      "buffer": require.resolve("buffer/"),
      "timers": require.resolve("timers-browserify")
    };

    return config;
  }
);
