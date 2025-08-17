interface Config {
  apiBase: string;
  gmapsUrl: string;
  keywords: string[];
}

export function parseQuery(): Config {
  const params = new URLSearchParams(window.location.search);
  
  // Parse Google Maps URL
  let gmapsUrl = params.get('gmaps') || import.meta.env.VITE_GMAPS_URL || '';
  
  // If no direct gmaps URL but place is provided, construct one
  if (!gmapsUrl && params.get('place')) {
    const place = encodeURIComponent(params.get('place')!);
    gmapsUrl = `https://www.google.com/maps/search/?api=1&query=${place}`;
  }
  
  // Parse keywords
  const keywordsParam = params.get('kw') || '';
  const keywords = keywordsParam
    ? keywordsParam.split(',').map(k => k.trim()).filter(Boolean)
    : [];
  
  return {
    apiBase: import.meta.env.VITE_API_BASE || '',
    gmapsUrl,
    keywords,
  };
}

// Local storage keys
export const STORAGE_KEYS = {
  IMPROVED_TEXT: 'reviewTool_improvedText',
  ORIGINAL_TEXT: 'reviewTool_originalText',
  API_BASE_OVERRIDE: 'reviewTool_apiBaseOverride',
} as const;

export function getStoredValue(key: string): string | null {
  try {
    return localStorage.getItem(key);
  } catch {
    return null;
  }
}

export function setStoredValue(key: string, value: string): void {
  try {
    localStorage.setItem(key, value);
  } catch (error) {
    console.warn('Failed to save to localStorage:', error);
  }
}