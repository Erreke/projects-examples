module.exports = {
  devServer: {
    host: 'localhost',
  },
  runtimeCompiler: true,
  transpileDependencies: [
    'vue-echarts',
    'resize-detector',
  ],
  pluginOptions: {
    webpackBundleAnalyzer: {
      openAnalyzer: false,
    },
  },
  pwa: {
    themeColor: '#050726',
    backgroundColor: '#050726',
    workboxPluginMode: 'InjectManifest',
    workboxOptions: {
      swSrc: 'src/utils/service-worker.js',
      exclude: [
        /\.map$/,
        /manifest\.json$/,
      ],
    },
  },
  chainWebpack: (config) => {
    config.module.rules.delete('eslint');
  },
  productionSourceMap: false,
};
