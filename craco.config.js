// craco.config.js
module.exports = {
    webpack: {
      configure: (webpackConfig) => {
        // Tell webpack “if you see fs, don’t try to bundle it”
        webpackConfig.resolve.fallback = {
          ...webpackConfig.resolve.fallback,
          fs: false,
        };
        return webpackConfig;
      },
    },
  };
  