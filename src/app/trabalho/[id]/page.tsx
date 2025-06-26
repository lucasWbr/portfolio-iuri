import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { prisma } from "@/lib/prisma";
import { Trabalho } from "@/types";
import Image from "next/image";
import { notFound } from "next/navigation";

interface TrabalhoPageProps {
  params: {
    id: string;
  };
}

// Buscar trabalho específico
async function getTrabalho(id: string): Promise<Trabalho | null> {
  try {
    const trabalho = (await prisma.trabalhos.findUnique({
      where: { id },
    })) as Trabalho | null;

    return trabalho;
  } catch (error) {
    console.error("Erro ao buscar trabalho:", error);
    return null;
  }
}

export default async function TrabalhoPage({ params }: TrabalhoPageProps) {
  const trabalho = await getTrabalho(params.id);

  if (!trabalho) {
    notFound();
  }

  const isYouTube = trabalho.type === "youtube";
  const isVideo = trabalho.type === "gif" || trabalho.type === "video";
  const isImage = trabalho.type === "image";

  return (
    <div className="min-h-screen bg-works-custom">
      <Header />

      <main className="max-w-6xl mx-auto px-6 py-8">
        {/* Título */}
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            {trabalho.name}
          </h1>

          {/* Tags */}
          {trabalho.tags.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {trabalho.tags.map((tag) => (
                <span
                  key={tag}
                  className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Conteúdo principal */}
        <div className="bg-white rounded-lg shadow-sm overflow-hidden mb-8">
          {/* YouTube Video */}
          {isYouTube && trabalho.image[0] && (
            <div className="aspect-video">
              <iframe
                src={`https://www.youtube.com/embed/${getYouTubeVideoId(
                  trabalho.image[0]
                )}`}
                title={trabalho.name}
                className="w-full h-full"
                allowFullScreen
              />
            </div>
          )}

          {/* Imagens */}
          {isImage && trabalho.image.length > 0 && (
            <div className="grid gap-4">
              {trabalho.image.length === 1 ? (
                // Imagem única
                <div
                  className="relative w-full"
                  style={{ aspectRatio: "16/9" }}
                >
                  <Image
                    src={trabalho.image[0]}
                    alt={trabalho.name}
                    fill
                    className="object-contain"
                  />
                </div>
              ) : (
                // Múltiplas imagens
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4">
                  {trabalho.image.map((img, index) => (
                    <div key={index} className="relative aspect-square">
                      <Image
                        src={img}
                        alt={`${trabalho.name} - ${index + 1}`}
                        fill
                        className="object-cover rounded-lg"
                      />
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* GIF ou Video */}
          {isVideo && trabalho.image[0] && (
            <div className="flex justify-center p-4">
              <video
                controls
                className="max-w-full h-auto"
                poster={trabalho.image[1]} // Segunda imagem como poster, se existir
              >
                <source src={trabalho.image[0]} type="video/mp4" />
                Seu navegador não suporta o elemento de vídeo.
              </video>
            </div>
          )}
        </div>

        {/* Texto descritivo (opcional) */}
        {trabalho.text && (
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="prose prose-gray max-w-none">
              <p className="text-gray-600 leading-relaxed whitespace-pre-wrap">
                {trabalho.text}
              </p>
            </div>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}

// Função auxiliar para extrair ID do YouTube
function getYouTubeVideoId(url: string): string {
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
  const match = url.match(regExp);
  return match && match[2].length === 11 ? match[2] : url;
}
