import { useEffect } from 'react';

interface SEOProps {
  title?: string;
  description?: string;
  image?: string;
  url?: string;
  type?: string;
}

const BASE_URL = 'https://amnafi.net';
const DEFAULT_IMAGE = `${BASE_URL}/og-image.jpg`;
const SITE_NAME = 'AMNAFI';

export default function SEO({ title, description, image, url, type = 'website' }: SEOProps) {
  const fullTitle = title ? `${title} | ${SITE_NAME}` : `${SITE_NAME} - Trouvez le bon prestataire près de chez vous`;
  const fullDescription = description || 'AMNAFI est la plateforme de référence au Sénégal pour trouver des prestataires de services.';
  const fullImage = image || DEFAULT_IMAGE;
  const fullUrl = url ? `${BASE_URL}${url}` : BASE_URL;

  useEffect(() => {
    document.title = fullTitle;
    setMeta('description', fullDescription);
    setMeta('robots', 'index, follow');
    setOg('title', fullTitle);
    setOg('description', fullDescription);
    setOg('image', fullImage);
    setOg('url', fullUrl);
    setOg('type', type);
    setTwitter('title', fullTitle);
    setTwitter('description', fullDescription);
    setTwitter('image', fullImage);
    setCanonical(fullUrl);
  }, [fullTitle, fullDescription, fullImage, fullUrl, type]);

  return null;
}

function setMeta(name: string, content: string) {
  let el = document.querySelector(`meta[name="${name}"]`) as HTMLMetaElement;
  if (!el) { el = document.createElement('meta'); el.name = name; document.head.appendChild(el); }
  el.content = content;
}

function setOg(property: string, content: string) {
  let el = document.querySelector(`meta[property="og:${property}"]`) as HTMLMetaElement;
  if (!el) { el = document.createElement('meta'); el.setAttribute('property', `og:${property}`); document.head.appendChild(el); }
  el.content = content;
}

function setTwitter(name: string, content: string) {
  let el = document.querySelector(`meta[name="twitter:${name}"]`) as HTMLMetaElement;
  if (!el) { el = document.createElement('meta'); el.name = `twitter:${name}`; document.head.appendChild(el); }
  el.content = content;
}

function setCanonical(url: string) {
  let el = document.querySelector('link[rel="canonical"]') as HTMLLinkElement;
  if (!el) { el = document.createElement('link'); el.rel = 'canonical'; document.head.appendChild(el); }
  el.href = url;
}
