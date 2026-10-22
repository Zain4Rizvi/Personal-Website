import type { NextConfig } from "next";
import { initOpenNextCloudflareForDev } from "@opennextjs/cloudflare";

initOpenNextCloudflareForDev();

const config: NextConfig = {
  poweredByHeader: false,
  env: { BUILD_YEAR: String(new Date().getFullYear()) },
};

export default config;
