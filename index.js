const svgr = require("@svgr/core").transform;
const resolveConfig = require("@svgr/core").resolveConfig;
const resolveConfigDir = require("path-dirname");
const upstreamTransformer = require("metro-react-native-babel-transformer");

const defaultSvgrConfig = {
  native: true,
  plugins: ["@svgr/plugin-svgo", "@svgr/plugin-jsx"],
  svgoConfig: {
    plugins: [
      {
        name: "preset-default",
        params: {
          overrides: {
            removeViewBox: false,
            removeUnknownsAndDefaults: false,
            convertColors: false,
            inlineStyles: {
              onlyMatchedOnce: false
            }
          }
        }
      }
    ]
  }
};

function transform({ src, filename, options }) {
  if (filename.endsWith(".svg")) {
    const config = resolveConfig.sync(resolveConfigDir(filename));
    const svgrConfig =
      config != null ? { ...defaultSvgrConfig, ...config } : defaultSvgrConfig;
    const jsCode = svgr.sync(src, svgrConfig, { filePath: filename });
    return upstreamTransformer.transform({
      src: jsCode,
      filename,
      options
    });
  }
  return upstreamTransformer.transform({ src, filename, options });
}

module.exports = {
  transform,
  getCacheKey: upstreamTransformer.getCacheKey
};
