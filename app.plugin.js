const { withAndroidManifest } = require("@expo/config-plugins");

/**
 * Ensures Android APK can reach HTTP/HTTPS APIs in release builds.
 */
function withAndroidNetworkConfig(config) {
  return withAndroidManifest(config, (config) => {
    const application = config.modResults.manifest?.application?.[0];
    if (application?.$) {
      application.$["android:usesCleartextTraffic"] = "true";
    }
    return config;
  });
}

module.exports = withAndroidNetworkConfig;
