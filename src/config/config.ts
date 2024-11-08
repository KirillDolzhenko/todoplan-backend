export default () => ({
  port: {
    server: process.env.PORT_SERVER,
  },
  jwt: {
    secret: {
      access: process.env.JWT_SECRET_ACCESS,
      refresh: process.env.JWT_SECRET_REFRESH,
    },
  },
});
