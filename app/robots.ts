import type { MetadataRoute } from "next";
import { getProfile } from "@/lib/content";

export default function robots(): MetadataRoute.Robots {
  return { rules: { userAgent: "*", allow: "/" }, sitemap: `${getProfile().siteUrl}/sitemap.xml` };
}
