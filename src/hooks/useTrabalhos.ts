import { useQuery } from "@tanstack/react-query";
import { Trabalho } from "@/types";

type FetchTrabalhosOptions = { all?: boolean };

async function fetchTrabalhos(
  options?: FetchTrabalhosOptions
): Promise<Trabalho[]> {
  const url = options?.all ? "/api/trabalhos?all=true" : "/api/trabalhos";
  const res = await fetch(url);
  const data = await res.json();
  if (!data.success) throw new Error(data.error || "Erro ao buscar trabalhos");
  return data.data;
}

export function useTrabalhos(options?: FetchTrabalhosOptions) {
  return useQuery<Trabalho[], Error>({
    queryKey: ["trabalhos", options],
    queryFn: () => fetchTrabalhos(options),
    staleTime: 3 * 60 * 60 * 1000, // 3 horas
    refetchOnWindowFocus: false,
  });
}
