import Constants from "expo-constants";
import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { NativeModules, View } from "react-native";

const getTurboModule = (
  globalThis as typeof globalThis & {
    __turboModuleProxy?: (moduleName: string) => unknown;
  }
).__turboModuleProxy;

export default function BannerAdView() {
  const [adsModule, setAdsModule] = useState<
    typeof import("react-native-google-mobile-ads") | null
  >(null);
  const adsEnabled = Constants.expoConfig?.extra?.adsEnabled !== false;
  const [reloadToken, setReloadToken] = useState(0);
  const [retryCount, setRetryCount] = useState(0);
  const [adSizeMode, setAdSizeMode] = useState<"ANCHOR" | "FULL" | "MEDIUM">(
    "ANCHOR"
  );
  const reloadTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const clearReloadTimeout = useCallback(() => {
    if (reloadTimeoutRef.current) {
      clearTimeout(reloadTimeoutRef.current);
      reloadTimeoutRef.current = null;
    }
  }, []);
  const scheduleReload = useCallback(
    (delayMs: number) => {
      clearReloadTimeout();
      reloadTimeoutRef.current = setTimeout(() => {
        setReloadToken((token) => token + 1);
      }, delayMs);
    },
    [clearReloadTimeout]
  );

  const hasNativeAdsModule = useMemo(() => {
    if ((NativeModules as any)?.RNGoogleMobileAdsModule) {
      return true;
    }

    if ((globalThis as any)?.ExpoModules?.RNGoogleMobileAdsModule) {
      return true;
    }

    if (typeof getTurboModule === "function") {
      try {
        return Boolean(getTurboModule("RNGoogleMobileAdsModule"));
      } catch {
        return false;
      }
    }

    return false;
  }, []);
  useEffect(() => {
    return () => {
      clearReloadTimeout();
    };
  }, [clearReloadTimeout]);

  useEffect(() => {
    let mounted = true;

    if (!adsEnabled || !hasNativeAdsModule) {
      setAdsModule(null);
      setRetryCount(0);
      setReloadToken(0);
      setAdSizeMode("ANCHOR");
      clearReloadTimeout();
      return;
    }

    const loadModule = async () => {
      try {
        const mod = require("react-native-google-mobile-ads");
        if (typeof mod?.default === "function") {
          try {
            await mod.default().initialize();
          } catch (initError) {
            console.log("Ads module failed to initialize", initError);
          }
        } else {
          console.log(
            "Ads module unavailable (module did not export a default initializer)"
          );
          return;
        }

        if (mounted) {
          setAdsModule(mod);
          setRetryCount(0);
          setAdSizeMode("ANCHOR");
          setReloadToken(0);
        }
      } catch (error) {
        if (mounted) {
          setAdsModule(null);
        }
        console.log(
          "Ads module unavailable (missing native Google Mobile Ads module)",
          error
        );
      }
    };

    loadModule();

    return () => {
      mounted = false;
      clearReloadTimeout();
    };
  }, [adsEnabled, hasNativeAdsModule, clearReloadTimeout]);

  if (!adsModule || !hasNativeAdsModule) return null;

  const { BannerAd, BannerAdSize, TestIds } = adsModule;
  const adUnitId = __DEV__
    ? TestIds?.BANNER ?? "ca-app-pub-3940256099942544/6300978111"
    : "ca-app-pub-7483950421454182/5588851792";
  const resolvedBannerSize =
    adSizeMode === "ANCHOR"
      ? BannerAdSize.ANCHORED_ADAPTIVE_BANNER
      : adSizeMode === "FULL"
      ? BannerAdSize.FULL_BANNER
      : BannerAdSize.MEDIUM_RECTANGLE;
  const bannerKey = `${adUnitId}-${adSizeMode}-${reloadToken}`;

  return (
    <View style={{ alignItems: "center", marginTop: 8, width: "100%" }}>
      <BannerAd
        key={bannerKey}
        unitId={adUnitId}
        size={resolvedBannerSize}
        requestOptions={{ requestNonPersonalizedAdsOnly: true }}
        onAdFailedToLoad={(e: any) => {
          const details = e?.nativeEvent ?? e;
          console.log("Banner failed", details);
          clearReloadTimeout();
          let sizeChanged = false;
          setAdSizeMode((currentSize) => {
            if (currentSize === "ANCHOR") {
              sizeChanged = true;
              return "FULL";
            }
            if (currentSize === "FULL") {
              sizeChanged = true;
              return "MEDIUM";
            }
            return currentSize;
          });
          setRetryCount((prev) => {
            const next = prev + 1;
            if (!sizeChanged) {
              const delay = Math.min(45000, 5000 * next);
              scheduleReload(delay);
            }
            return next;
          });
        }}
        onAdLoaded={() => {
          clearReloadTimeout();
          setRetryCount(0);
        }}
      />
    </View>
  );
}
