import { Tag, Trabalho } from "@/types";

export async function getTagsServer(): Promise<Tag[]> {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_URL || ""}/api/tags`,
    {
      cache: "no-store",
    }
  );
  const data = await res.json();
  if (!data.success) throw new Error(data.error || "Erro ao buscar tags");
  return data.data;
}

export async function getTrabalhosServer(): Promise<Trabalho[]> {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_URL || ""}/api/trabalhos`,
    {
      cache: "no-store",
    }
  );
  const data = await res.json();
  if (!data.success) throw new Error(data.error || "Erro ao buscar trabalhos");
  return data.data;
}
