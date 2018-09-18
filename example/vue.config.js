const CompressionWebpackPlugin = require('compression-webpack-plugin')

module.exports = {
  baseUrl: '/example',
  devServer: {
    proxy: 'http://localhost:19898'
  },
  configureWebpack: {
    plugins: [
      new CompressionWebpackPlugin({
        // asset: '[path].gz[query]',
        algorithm: 'gzip',
        test: new RegExp(
          '\\.(' +
          ['js', 'css'].join('|') +
          ')$'
        ),
        threshold: 1024,
        minRatio: 0.8
      })
    ]
  }
}
