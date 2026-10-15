import type { MetadataRoute } from "next";
import { getProfile, getProjects } from "@/lib/content";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = getProfile().siteUrl;
  return [
    { url: base },
    ...getProjects().filter((p) => p.featured).map((p) => ({ url: `${base}/projects/${p.slug}` })),
  ];
}
