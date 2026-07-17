/** @type {import('next').NextConfig} */
const nextConfig = {
  async redirects() {
    return [
      {
        source: '/weighbridges',
        destination: '/scales',
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
