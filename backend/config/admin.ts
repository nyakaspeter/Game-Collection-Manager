export default ({ env }) => ({
  auth: {
    secret: env('ADMIN_JWT_SECRET', 'fac38faf434f4a2bf6814366332d6c83'),
  },
});
