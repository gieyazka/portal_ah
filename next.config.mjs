/** @type {import('next').NextConfig} */

import million from 'million/compiler';
import withPWA from 'next-pwa'

const conf = withPWA(

  {
    dest: 'public',
    register: true,
    skipWaiting: true,
    disable: process.env.NODE_ENV === "development",

  }

)
// const withPWA = require('next-pwa')({
//   dest: 'public',
//   register: true,
//   skipWaiting: true,
//   disable: process.env.NODE_ENV === "development",

// })
const nextConfig = {
  // api: {
  //   responseLimit: false,
  // },
  images: {
    remotePatterns: [
      // {
      //   protocol: 'http',
      //   // hostname: "10.10.20.34",
      //   hostname: process.env.NEXT_PUBLIC_Strapi_Org_no_head,
      //   port: '1337',
      //   // pathname: '/uploads/**',
      // },
      {
        protocol: 'https',
        // hostname: "10.10.20.34",
        hostname: "apigw.aapico.com",
        port: '',
        pathname: '/mediaflow/**',
      },
    ],
  },
  webpack(config) {
    // Grab the existing rule that handles SVG imports
    const fileLoaderRule = config.module.rules.find((rule) =>
      rule.test?.test?.('.svg'),
    )
    config.resolve.alias.canvas = false
    config.resolve.alias.encoding = false
    config.module.rules.push(
      // Reapply the existing rule, but only for svg imports ending in ?url
      {
        ...fileLoaderRule,
        test: /\.svg$/i,
        resourceQuery: /url/, // *.svg?url
      },
      // Convert all other *.svg imports to React components
      {
        test: /\.svg$/i,
        issuer: /\.[jt]sx?$/,
        resourceQuery: { not: /url/ }, // exclude if *.svg?url
        use: ['@svgr/webpack'],
      }, {
      test: /\.node/,
      use: 'raw-loader',
    }
    )

    // Modify the file loader rule to ignore *.svg, since we have it handled now.
    fileLoaderRule.exclude = /\.svg$/i

    return config
  },
  reactStrictMode: false,
  // experimental: { appDir: true },
  typescript: {
    // !! WARN !!
    // Dangerously allow production builds to successfully complete even if
    // your project has type errors.
    // !! WARN !!
    ignoreBuildErrors: true,
    // i18n,

  },

}
const millionConfig = {
  auto: true,
  // if you're using RSC:
  // auto: { rsc: true },
}


// module.exports = (nextConfig)
export default million.next(conf(nextConfig),millionConfig)
  // withPWA({
  //   ...million.next(nextConfig),
  //   pwa: {
  //     dest: 'public',
  //     register: true,
  //     skipWaiting: true,
  //     disable: process.env.NODE_ENV === "development",

  //   }
  // })
