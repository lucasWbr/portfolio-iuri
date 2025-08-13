"use client";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ContactButton from "@/components/ContactButton";
import { useLanguage } from "@/hooks/use-language";
import { useTags } from "@/hooks/useTags";
import { useTrabalhos } from "@/hooks/useTrabalhos";
import Link from "next/link";
import Image from "next/image";

export default function HomeClient() {
  const { isLoading: languageLoading } = useLanguage();
  const {
    data: trabalhos,
    isLoading: trabalhosLoading,
    error: trabalhosError,
  } = useTrabalhos();
  const { data: tags, isLoading: tagsLoading, error: tagsError } = useTags();

  const isLoading = trabalhosLoading || tagsLoading || languageLoading;

  if (isLoading) {
    return (
      <div className="min-h-screen bg-index-custom flex flex-col">
        <Header showTags={true} />
        <main className="flex-1 w-full mx-auto py-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-5 px-6">
            {[...Array(6)].map((_, i) => (
              <div
                key={i}
                className="relative aspect-square w-full min-h-[260px] md:min-h-[340px] lg:min-h-[420px] bg-gray-200 animate-pulse"
              />
            ))}
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (trabalhosError || tagsError) {
    return (
      <div className="min-h-screen bg-index-custom flex flex-col">
        <Header showTags={true} />
        <main className="flex-1 w-full mx-auto py-8">
          <div className="text-center py-16">
            <p className="text-gray-500 text-lg">Erro ao carregar dados.</p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-index-custom flex flex-col">
      <Header showTags={true} tags={tags?.map((tag) => tag.name) || []} />
      {/* Grid de trabalhos */}
      <main className="flex-1 w-full mx-auto py-8">
        {!trabalhos || trabalhos.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-gray-500 text-lg">Nenhum trabalho encontrado.</p>
            <p className="text-gray-400 mt-2">
              Os trabalhos aparecerão aqui quando forem adicionados.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-5 px-6">
            {trabalhos.map((trabalho) => (
              <Link
                key={trabalho.id}
                href={`/trabalho/${trabalho.id}`}
                className="group block focus:outline-none"
                tabIndex={0}
              >
                <div className="relative aspect-square w-full min-h-[260px] md:min-h-[340px] lg:min-h-[420px]">
                  <Image
                    src={trabalho.image[0]}
                    alt={trabalho.name}
                    fill
                    className="object-cover transition-transform duration-200"
                    placeholder="empty"
                    unoptimized={trabalho.image[0]?.endsWith(".gif")}
                  />
                  <div
                    className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 group-focus:opacity-100 transition-opacity duration-300"
                    style={{ backgroundColor: "#0041ff" }}
                  >
                    <span className="text-white font-bold font-archivo-narrow text-xl md:text-2xl lg:text-3xl text-center px-2 select-none group-hover:scale-110 transition-transform duration-300">
                      {trabalho.name}
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </main>
      <Footer />
      <ContactButton />
    </div>
  );
}
