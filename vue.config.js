"use strict";
const path = require("path");

function resolve(dir) {
  return path.join(__dirname, dir);
}

const name = "The UltronGlow Blockchain Explorer"; 
const port = 9930;
const version = new Date().getTime();
module.exports = {
 //publicPath: "./", //hash
  publicPath:'/',    //history
  outputDir: "dist",
  assetsDir: "static",
  lintOnSave: false,
  chainWebpack: (config) => {
    config.plugin("html").tap((args) => {
      args[0].ieRend = new Date().getTime();
      return args;
    });
    config.output.filename("static/js/[name]." + version + ".js").end();
    config.output.chunkFilename("static/js/[name]." + version + ".js").end();

    config.plugin('preload').tap(() => [
      {
        rel: 'preload',
        // to ignore runtime.js
        // https://github.com/vuejs/vue-cli/blob/dev/packages/@vue/cli-service/lib/config/app.js#L171
        fileBlacklist: [/\.map$/, /hot-update\.js$/, /runtime\..*\.js$/],
        include: 'initial'
      }
    ])
    // when there are many pages, it will cause too many meaningless requests
    config.plugins.delete('prefetch')

  },
  
  configureWebpack: (config) => {
    if (process.env.NODE_ENV === "production") {
      config.mode = "production";
    } else {
      config.mode = "development";
    }
    Object.assign(config, {
      resolve: {
        alias: {
          "@": resolve("src"),
        },
      },
    });
  },
  productionSourceMap: false,
  parallel: require("os").cpus().length > 1,
  pwa: {},

  devServer: {
    open: true,
    //host: "192.168.100.190",
    port: port,
    overlay: {
      warnings: true,
      errors: true,
    },
    historyApiFallback: true,
  },
  pluginOptions: {},
};
