// Utilitário de cache de tags no localStorage
// Tempo de expiração padrão: 3 horas

const TAGS_CACHE_KEY = "portfolio_tags_cache";
const TAGS_CACHE_EXPIRATION = 3 * 60 * 60 * 1000; // 3 horas em ms

export type Tag = { name: string };

interface TagsCacheData {
  tags: string[];
  timestamp: number;
}

export function getCachedTags(): string[] | null {
  if (typeof window === "undefined") return null;
  try {
    const cache = localStorage.getItem(TAGS_CACHE_KEY);
    if (!cache) return null;
    const data: TagsCacheData = JSON.parse(cache);
    if (Date.now() - data.timestamp > TAGS_CACHE_EXPIRATION) {
      clearCachedTags();
      return null;
    }
    return data.tags;
  } catch {
    return null;
  }
}

export function setCachedTags(tags: string[]) {
  if (typeof window === "undefined") return;
  const data: TagsCacheData = {
    tags,
    timestamp: Date.now(),
  };
  localStorage.setItem(TAGS_CACHE_KEY, JSON.stringify(data));
}

export function clearCachedTags() {
  if (typeof window === "undefined") return;
  localStorage.removeItem(TAGS_CACHE_KEY);
}

// Função principal: busca tags usando cache, com fallback
export async function fetchTagsWithCache(): Promise<string[]> {
  // 1. Tenta pegar do cache
  const cached = getCachedTags();
  if (cached) return cached;

  // 2. Busca da API de tags
  try {
    const response = await fetch("/api/tags");
    const data = await response.json();
    if (data.success) {
      const tagNames = data.data?.map((tag: Tag) => tag.name) || [];
      setCachedTags(tagNames);
      return tagNames;
    }
  } catch {}

  // 3. Fallback: busca das tags dos trabalhos
  try {
    const response = await fetch("/api/trabalhos");
    const trabalhoData = await response.json();
    if (trabalhoData.success) {
      const allTags =
        trabalhoData.data?.flatMap((trabalho: any) => trabalho.tags) || [];
      const uniqueTags = [...new Set(allTags)] as string[];
      setCachedTags(uniqueTags);
      return uniqueTags;
    }
  } catch {}

  // 4. Se tudo falhar, retorna array vazio
  return [];
}
