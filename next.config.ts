import type { NextConfig } from "next";

const config: NextConfig = {
  output: "standalone",
  poweredByHeader: false,
  // content/ is read at runtime via fs; make sure it ships in the standalone bundle
  outputFileTracingIncludes: { "/**": ["./content/**/*"] },
};

export default config;
