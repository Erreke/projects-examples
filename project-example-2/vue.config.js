module.exports = {
  devServer: {
    host: "localhost"
  },
  pwa: {
    workboxPluginMode: "InjectManifest",
    workboxOptions: {
      swSrc: "src/utils/service-worker.js",
      exclude: [/\.map$/, /manifest\.json$/]
    }
  }
};
