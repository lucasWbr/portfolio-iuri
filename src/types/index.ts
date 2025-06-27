export interface Trabalho {
  id: string;
  name: string;
  text: string | null;
  textEn: string | null;
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
  textEn: string | null;
  fotoBio: string | null;
  email: string | null;
  telefone: string | null;
  behance: string | null;
  linkedin: string | null;
  facebook: string | null;
  instagram: string | null;
  createdAt: Date;
  updatedAt: Date;
}
