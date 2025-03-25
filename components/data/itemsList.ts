export type PortfolioItem = {
  id: string;
  title: string;
  description: string;
  images: Array<string>;
  tags: Array<string>;
  link?: string;
  MediaType?: string;
};

export const list: Array<PortfolioItem> = [
  {
    id: "1",
    title: "My First Project",
    description:
      "This is my first project, it is a simple project that I made to learn how to use Next.js and TailwindCSS.",
    images: ["logo.png"],
    tags: ["Next.js", "TailwindCSS"],
    link: "linkdefault",
    MediaType: "type",
  },
  {
    id: "2",
    title: "My First Project",
    description:
      "This is my first project, it is a simple project that I made to learn how to use Next.js and TailwindCSS.",
    images: ["logo.png"],
    tags: ["peru", "TailwindCSS"],
    link: "linkdefault",
    MediaType: "type",
  },
  {
    id: "4",
    title: "My First Project",
    description:
      "This is my first project, it is a simple project that I made to learn how to use Next.js and TailwindCSS.",
    images: ["logo.png"],
    tags: ["loucura, loucura", "TailwindCSS"],
    link: "linkdefault",
    MediaType: "type",
  },
  {
    id: "3",
    title: "My First Project",
    description:
      "This is my first project, it is a simple project that I made to learn how to use Next.js and TailwindCSS.",
    images: ["logo.png"],
    tags: ["Next.js", "Jorge"],
    link: "linkdefault",
    MediaType: "type",
  },
  {
    id: "5",
    title: "My First Project",
    description:
      "This is my first project, it is a simple project that I made to learn how to use Next.js and TailwindCSS.",
    images: ["logo.png"],
    tags: ["Next.js", "Jorge"],
    link: "linkdefault",
    MediaType: "type",
  },
  {
    id: "6",
    title: "My First Project",
    description:
      "This is my first project, it is a simple project that I made to learn how to use Next.js and TailwindCSS.",
    images: ["logo.png"],
    tags: ["Next.js", "Jorge"],
    link: "linkdefault",
    MediaType: "type",
  },
];
