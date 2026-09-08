/**
 * Custom next/image loader required for static export (output: "export").
 * There is no image optimization server on GitHub Pages, so this just
 * returns the original asset path with the site's basePath prepended —
 * without a custom loader, next/image silently drops basePath from raw
 * string `src` values, which 404s once deployed under a repo subdirectory.
 */
export default function imageLoader({ src }: { src: string; width: number; quality?: number }) {
  const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? '';
  return `${basePath}${src}`;
}
