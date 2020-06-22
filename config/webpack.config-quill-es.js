const fs = require("fs");
const path = require("path");
const resolve = require("resolve");
const webpack = require("webpack");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const ForkTsCheckerWebpackPlugin = require("react-dev-utils/ForkTsCheckerWebpackPlugin");
const typescriptFormatter = require("react-dev-utils/typescriptFormatter");
const postcssNormalize = require("postcss-normalize");
const PnpWebpackPlugin = require("pnp-webpack-plugin");
const ModuleScopePlugin = require("react-dev-utils/ModuleScopePlugin");

const paths = require("./paths");
const modules = require("./modules");
const useTypeScript = fs.existsSync(paths.appTsConfig);
const shouldUseSourceMap = process.env.GENERATE_SOURCEMAP !== "false";
const isEnvProductionProfile = process.argv.includes("--profile");

module.exports = function() {
  return {
    mode: "production",
    devtool: "source-map",
    entry: {
      "index": paths.quillIndex, 
      "videoPlayer": paths.quillVideo
    },
    output: {
      path: paths.quillEs,
      publicPath: "./",
      filename: "[name].js",
      // library: 'MediaQuill',
      libraryTarget: 'umd',
      umdNamedDefine: true,
      libraryExport: 'default',
    },
    resolve: {
      modules: ["node_modules", paths.appNodeModules].concat(modules.additionalModulePaths || []),
      extensions: paths.moduleFileExtensions.map(ext => `.${ext}`).filter(ext => useTypeScript || !ext.includes("ts")),
      alias: {
        "react-native": "react-native-web",
        ...(isEnvProductionProfile && {
          "react-dom$": "react-dom/profiling",
          "scheduler/tracing": "scheduler/tracing-profiling"
        }),
        ...(modules.webpackAliases || {})
      },
      plugins: [PnpWebpackPlugin, new ModuleScopePlugin(paths.appSrc, [paths.appPackageJson])]
    },
    resolveLoader: {
      plugins: [PnpWebpackPlugin.moduleLoader(module)]
    },
    externals: { // 定义外部依赖，避免把react和react-dom打包进去
      dompurify: {
          root: "dompurify",
          commonjs2: "dompurify",
          commonjs: "dompurify",
          amd: "dompurify",
      },
      lodash: {
          root: "lodash",
          commonjs2: "lodash",
          commonjs: "lodash",
          amd: "lodash",
      },
      quill: {
          root: "quill",
          commonjs2: "quill",
          commonjs: "quill",
          amd: "quill",
      }
    },
    module: {
      strictExportPresence: true,
      rules: [
        { parser: { requireEnsure: false } },
        {
          oneOf: [
            {
              test: /\.(js|ts|tsx)$/,
              include: paths.appSrc,
              loader: require.resolve("babel-loader"),
              options: {
                customize: require.resolve("babel-preset-react-app/webpack-overrides"),
                plugins: [
                  [
                    require.resolve("babel-plugin-named-asset-import"),
                    {
                      loaderMap: {
                        svg: {
                          ReactComponent: "@svgr/webpack?-svgo,+titleProp,+ref![path]"
                        }
                      }
                    }
                  ]
                ],
                cacheDirectory: true,
                cacheCompression: false,
                compact: true
              }
            },
            {
              test: /\.(scss|sass)$/,
              exclude: /\.module\.(scss|sass)$/,
              use: [
                {
                  loader: MiniCssExtractPlugin.loader,
                  options: paths.publicUrlOrPath.startsWith(".") ? { publicPath: "../../" } : {}
                },
                {
                  loader: require.resolve("css-loader"),
                  options: {
                    importLoaders: 3,
                    sourceMap: shouldUseSourceMap
                  }
                },
                {
                  loader: "postcss-loader",
                  options: {
                    ident: "postcss",
                    plugins: () => [
                      require("postcss-flexbugs-fixes"),
                      require("postcss-preset-env")({
                        autoprefixer: {
                          flexbox: "no-2009"
                        },
                        stage: 3
                      }),
                      postcssNormalize()
                    ],
                    sourceMap: shouldUseSourceMap
                  }
                },
                "sass-loader"
              ]
            }
          ]
        }
      ]
    },
    plugins: [
      new MiniCssExtractPlugin({
        filename: `[name].scss`
      }),
      new ForkTsCheckerWebpackPlugin({
        typescript: resolve.sync("typescript", {
          basedir: paths.appNodeModules
        }),
        async: false,
        useTypescriptIncrementalApi: true,
        checkSyntacticErrors: true,
        resolveModuleNameModule: process.versions.pnp ? `${__dirname}/pnpTs.js` : undefined,
        resolveTypeReferenceDirectiveModule: process.versions.pnp ? `${__dirname}/pnpTs.js` : undefined,
        tsconfig: paths.appTsConfig,
        reportFiles: [
          "**",
          "!**/__tests__/**",
          "!**/?(*.)(spec|test).*",
          "!**/src/setupProxy.*",
          "!**/src/setupTests.*"
        ],
        silent: true,
        // The formatter is invoked directly in WebpackDevServerUtils during development
        formatter: typescriptFormatter
      }),
      new webpack.DefinePlugin({
        "process.env": {
          NODE_ENV: JSON.stringify("production")
        }
      })
    ]
  };
};
