module.exports = {
  pwa: {
    name: "Squirrel School Days",
    msTileColor: "#007515",
    manifestCrossorigin: "anonymous",
    manifestOptions: {
      background_color: "#007515",
    },
    // workboxPluginMode: "InjectManifest",
    // workboxOptions: {
    //   // swSrc is required in InjectManifest mode.
    //   swSrc: "/sw.js",
    //   // ...other Workbox options...
    // },
  },
  css: {
    loaderOptions: {
      sass: {
        // Prefer Dart Sass
        implementation: require("sass"),

        // See https://github.com/webpack-contrib/sass-loader/issues/804
        webpackImporter: false,
        sassOptions: {
          includePaths: ["./node_modules"],
        },
      },
    },
  },
};
