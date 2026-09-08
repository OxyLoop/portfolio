// GitHub Pages hosts project sites under /<repo-name>/, so every asset path
// needs that prefix baked in at build time. When this build runs inside the
// GitHub Actions workflow (see .github/workflows/deploy.yml), GITHUB_REPOSITORY
// is set automatically to "owner/repo" — we derive the base path from it so
// you don't have to hardcode your repo name anywhere. A user/organization
// page repo (named "<username>.github.io") is served from the domain root,
// so it gets no base path.
//
// Building locally (npm run dev / npm run build) always uses an empty base
// path so local previews work at http://localhost:3000.
const repoName = process.env.GITHUB_REPOSITORY?.split('/')[1] ?? '';
const isUserOrgPage = repoName.endsWith('.github.io');
const basePath = process.env.GITHUB_ACTIONS && repoName && !isUserOrgPage ? `/${repoName}` : '';

/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  basePath,
  assetPrefix: basePath,
  trailingSlash: true,
  images: {
    loader: 'custom',
    loaderFile: './src/lib/imageLoader.ts',
  },
  env: {
    NEXT_PUBLIC_BASE_PATH: basePath,
  },
};

export default nextConfig;
