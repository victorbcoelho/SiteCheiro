import { MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://sopre.me';

  return [
    { url: `${baseUrl}/`, lastModified: new Date() },
    { url: `${baseUrl}/empresas`, lastModified: new Date() },
    { url: `${baseUrl}/pre-venda`, lastModified: new Date() },
  ];
}
