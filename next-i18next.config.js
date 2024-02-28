/** @type {import('next-i18next').UserConfig} */
module.exports = {
  i18n: {
    defaultLocale: 'en',
    locales: ['en', 'th'],
    localeDetection: true,
    fallbackLng: {
      default: ['en'],
    },
  },
}