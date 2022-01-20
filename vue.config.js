module.exports = {
  pwa: {
    name: "InspirobotBatch",
    msTileColor: "#007515",
    manifestCrossorigin: "anonymous",
    manifestOptions: {
      background_color: "#007515",
    },
    workboxPluginMode: "InjectManifest",
    workboxOptions: {
      // swSrc is required in InjectManifest mode.
      swSrc: "/sw.js",
      // ...other Workbox options...
    },
  },
};
