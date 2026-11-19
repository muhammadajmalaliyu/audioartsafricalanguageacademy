module.exports = {
  reactStrictMode: true,
  async redirects() {
    return [{ source: "/signup", destination: "/auth/register", permanent: false }];
  },
};
