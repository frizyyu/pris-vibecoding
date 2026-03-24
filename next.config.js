/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  experimental: {
    webpackBuildWorker: false,
    devtoolSegmentExplorer: false,
    browserDebugInfoInTerminal: false,
  },
};

module.exports = nextConfig;
