-- CreateTable
CREATE TABLE "trabalhos" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "text" TEXT,
    "textEn" TEXT,
    "image" TEXT[],
    "tags" TEXT[],
    "type" TEXT NOT NULL,
    "youtubeUrl" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "trabalhos_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "usuario" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "text" TEXT NOT NULL,
    "textEn" TEXT,
    "behance" TEXT,
    "linkedin" TEXT,
    "facebook" TEXT,
    "instagram" TEXT,
    "font" TEXT NOT NULL DEFAULT 'Inter',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "usuario_pkey" PRIMARY KEY ("id")
);
