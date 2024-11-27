const { getDefaultConfig } = require("expo/metro-config");
const { withNativeWind } = require("nativewind/metro");

const config = getDefaultConfig(__dirname, {
  isCSSEnabled: true,
});

// Điều chỉnh cấu hình transformer
config.transformer = {
  // Kết hợp với transformer mặc định
  ...config.transformer,
  // Thêm đường dẫn tới react-native-svg-transformer
  babelTransformerPath: require.resolve("react-native-svg-transformer"),
  assetPlugins: ["expo-asset/tools/hashAssetFiles"],
};

// Điều chỉnh cấu hình resolver
config.resolver = {
  // Loại bỏ "svg" khỏi assetExts
  assetExts: config.resolver.assetExts.filter((ext) => ext !== "svg"),
  // Thêm "svg" vào sourceExts
  sourceExts: [...config.resolver.sourceExts, "svg"],
};

module.exports = withNativeWind(config, { input: "./global.css" });
