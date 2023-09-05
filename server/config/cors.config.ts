export const getCorsOptions = () => ({
  credentials: true,
  origin: [String(process.env.MAIN_URL), String(process.env.ADMIN_URL), String(process.env.NUXT_URL)],
});