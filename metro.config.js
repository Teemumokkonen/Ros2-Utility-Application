const { getDefaultConfig, mergeConfig } = require('@react-native/metro-config');
const { wrapWithReanimatedMetroConfig } = require('react-native-reanimated/metro-config');

module.exports = (async () => {
  const defaultConfig = await getDefaultConfig(__dirname);

  const config = {
    resetCache: true,
  };

  return wrapWithReanimatedMetroConfig(
    mergeConfig(defaultConfig, config)
  );
})();
