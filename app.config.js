export default {
  expo: {
    name: "PetCare",
    slug: "PetCare",
    version: "1.0.0",
    orientation: "portrait",
    icon: "./assets/logo.png",
    scheme: "petcare",
    userInterfaceStyle: "light",
    splash: {
      image: "./assets/splash.png",
      resizeMode: "contain",
      backgroundColor: "#000000"
    },
    assetBundlePatterns: ["**/*"],
    androidStatusBar: {
      barStyle: "light-content",
      backgroundColor: "#000000"
    },
    ios: {
      supportsTablet: true,
      bundleIdentifier: "com.ismael21986.IndorPadel"
    },
    android: {
      package: "com.ismael21986.IndorPadel",
      versionCode: 1,
      permissions: ["android.permission.CAMERA"]
    },
    web: {
      favicon: "./assets/favicon.png"
    },
    plugins: [
      "expo-web-browser",

    ],
    extra: {
      eas: {
        projectId: "9baf0d32-aa59-4c50-8746-6496f1a49e9a"
      }
    },
    owner: "ismael21986"
  }
};
