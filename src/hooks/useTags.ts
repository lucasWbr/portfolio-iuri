import { useQuery } from "@tanstack/react-query";
import { Tag } from "@/types";

async function fetchTags(): Promise<Tag[]> {
  const res = await fetch("/api/tags");
  const data = await res.json();
  if (!data.success) throw new Error(data.error || "Erro ao buscar tags");
  return data.data;
}

export function useTags() {
  return useQuery<Tag[], Error>({
    queryKey: ["tags"],
    queryFn: fetchTags,
    staleTime: 3 * 60 * 60 * 1000, // 3 horas
    refetchOnWindowFocus: false,
  });
}
