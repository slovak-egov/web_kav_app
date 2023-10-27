export const axiosProxyOptions =
  !!process.env.NEXT_HTTP_PROXY_HOSTNAME && !!process.env.NEXT_HTTP_PROXY_PORT
    ? {
        proxy: {
          host: process.env.NEXT_HTTP_PROXY_HOSTNAME,
          port: Number(process.env.NEXT_HTTP_PROXY_PORT),
          protocol: 'http'
        }
      }
    : {};
