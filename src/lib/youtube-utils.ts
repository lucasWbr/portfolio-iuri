// Utilitários para trabalhar com URLs do YouTube

export function extractYouTubeVideoId(url: string): string | null {
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
  const match = url.match(regExp);
  return match && match[2].length === 11 ? match[2] : null;
}

export function getYouTubeThumbnailUrl(
  videoId: string,
  quality: "default" | "medium" | "high" | "maxres" = "maxres"
): string {
  return `https://img.youtube.com/vi/${videoId}/${quality}default.jpg`;
}

export async function fetchYouTubeThumbnail(
  youtubeUrl: string
): Promise<string | null> {
  try {
    const videoId = extractYouTubeVideoId(youtubeUrl);
    if (!videoId) return null;

    // Tenta diferentes qualidades de thumbnail
    const qualities: Array<"maxres" | "high" | "medium" | "default"> = [
      "maxres",
      "high",
      "medium",
      "default",
    ];

    for (const quality of qualities) {
      const thumbnailUrl = getYouTubeThumbnailUrl(videoId, quality);

      try {
        // Verifica se a thumbnail existe fazendo uma requisição HEAD
        const response = await fetch(thumbnailUrl, { method: "HEAD" });
        if (response.ok) {
          return thumbnailUrl;
        }
      } catch {
        continue;
      }
    }

    return null;
  } catch (error) {
    console.error("Erro ao buscar thumbnail do YouTube:", error);
    return null;
  }
}

export function isValidYouTubeUrl(url: string): boolean {
  const videoId = extractYouTubeVideoId(url);
  return videoId !== null;
}
