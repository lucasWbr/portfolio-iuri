export interface Trabalho {
  id: string;
  name: string;
  text: string | null;
  image: string[];
  tags: string[];
  type: string;
  youtubeUrl?: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface Usuario {
  id: string;
  name: string;
  text: string;
  behance: string | null;
  linkedin: string | null;
  facebook: string | null;
  instagram: string | null;
  colorHeader: string;
  colorBackgroundIndex: string;
  colorBackgroundWorks: string;
  font: string;
  createdAt: Date;
  updatedAt: Date;
}
