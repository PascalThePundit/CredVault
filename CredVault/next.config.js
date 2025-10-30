// /** @type {import('next').NextConfig} */
// const nextConfig = {
//   reactStrictMode: true,

// }

// module.exports = nextConfig

/** @type {import('next').NextConfig} */
const nextConfig = {
  // ... any other config you have ...

  typescript: {
    // !! WARN !!
    // Dangerously allow production builds to successfully complete even if
    // your project has type errors.
    // !! WARN !!
    ignoreBuildErrors: true,
  },
};

module.exports = nextConfig;