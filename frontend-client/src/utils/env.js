const env = {
  mode: import.meta.env.MODE,
  base: import.meta.env.BASE_URL,
  isDev: import.meta.env.DEV,
  isProd: import.meta.env.PROD,
  ssr: import.meta.env.SSR,
};
export const {
  mode,
  base,
  isDev,
  isProd,
  ssr,
} = env;
