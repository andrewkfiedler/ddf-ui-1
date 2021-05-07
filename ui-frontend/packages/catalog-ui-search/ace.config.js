module.exports = {
  optimization: {
    splitChunks: {
      chunks: 'async',
      minSize: 20000,
      minChunks: 1,
      maxAsyncRequests: 30,
      maxInitialRequests: 30,
      enforceSizeThreshold: 50000,
      cacheGroups: {
        defaultVendors: {
          test: /[\\/]node_modules[\\/]/,
          priority: -10,
          reuseExistingChunk: true,
        },
        default: {
          minChunks: 2,
          priority: -20,
          reuseExistingChunk: true,
        },
        cesium: {
          // sync + async chunks
          chunks: 'all',
          priority: 50,
          // import file path containing node_modules
          test: /[\\/]node_modules[\\/](cesium)[\\/]/,
        },
        openlayers: {
          // sync + async chunks
          chunks: 'all',
          priority: 50,
          // import file path containing node_modules
          test: /[\\/]node_modules[\\/](openlayers)[\\/]/,
        },
        plotly: {
          // sync + async chunks
          chunks: 'all',
          priority: 50,
          // import file path containing node_modules
          test: /[\\/]node_modules[\\/](plotly\.js)[\\/]/,
        },
        //
        'core-vendor': {
          // sync + async chunks
          chunks: 'all',
          priority: 20,
          // import file path containing node_modules
          test: /[\\/]node_modules[\\/](react|react-dom|backbone|marionette|jquery|underscore|lodash)[\\/]/,
        },
        vendor: {
          // sync + async chunks
          chunks: 'all',
          // import file path containing node_modules
          test: /[\\/]node_modules[\\/]/,
        },
      },
    },
  },
}
