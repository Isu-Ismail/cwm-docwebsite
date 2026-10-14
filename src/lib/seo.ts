import { siteInfo } from './data'

/** Public origin plus deploy base, no trailing slash. Override at build time with VITE_SITE_URL. */
export const SITE_URL: string = (import.meta.env.VITE_SITE_URL ?? siteInfo.siteUrl).replace(/\/$/, '')

export function canonicalFor(path: string): string {
  return SITE_URL + (path === '/' ? '/' : path + '/')
}

export function jsonLd(path: string): object | null {
  if (path !== '/') return null
  return {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: 'cwm',
    alternateName: siteInfo.fullName,
    applicationCategory: 'DeveloperApplication',
    operatingSystem: 'Windows, Linux, macOS',
    softwareVersion: siteInfo.version.replace(/^v/, ''),
    description: siteInfo.description,
    url: canonicalFor('/'),
    downloadUrl: siteInfo.releases,
    offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
  }
}
