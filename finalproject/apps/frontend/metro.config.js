const { getDefaultConfig } = require("expo/metro-config");
const { withNativeWind } = require("nativewind/metro");

const config = getDefaultConfig(__dirname);

// IMPORTANTE: Configuración adicional para Windows
config.resolver.sourceExts.push("css");
config.resolver.unstable_enableSymlinks = false;

module.exports = withNativeWind(config, {
  input: "./app/global.css", // ✅ Corregido: apunta a app/global.css
});
