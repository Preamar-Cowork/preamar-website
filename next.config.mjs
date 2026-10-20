/** @type {import('next').NextConfig} */

// Photos uploaded in /admin live in Supabase Storage. They are served through
// Vercel's image optimizer (resized + WebP/AVIF, cached for a year — every upload
// has a unique file name), so each visit no longer downloads the 2–3 MB originals
// from Supabase.
const supabaseHost = (() => {
  try {
    return new URL(process.env.NEXT_PUBLIC_SUPABASE_URL || "").hostname;
  } catch {
    return "";
  }
})() || "osftjchzzkocvmwgvyfx.supabase.co";

const nextConfig = {
  images: {
    remotePatterns: [{ protocol: "https", hostname: supabaseHost, pathname: "/storage/v1/object/public/**" }],
    formats: ["image/avif", "image/webp"],
    minimumCacheTTL: 31536000,
  },
};

export default nextConfig;
