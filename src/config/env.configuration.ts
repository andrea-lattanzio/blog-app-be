export default (): Record<string, object> => ({
  server: {
    environment: process.env.NODE_ENV,
    port: process.env.PORT,
  },
  database: {
    uri: process.env.DATABASE_URL,
  },
  auth: {
    secret: process.env.JWT_SECRET,
    expiration: process.env.ACCESS_TOKEN_VALIDITY_DURATION_IN_SEC,
  },
  mail: {
    host: process.env.EMAIL_HOST,
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
    from: process.env.EMAIL_FROM,
  },
  frontend: {
    baseUri: process.env.FRONTEND_BASE_URI,
  },
});