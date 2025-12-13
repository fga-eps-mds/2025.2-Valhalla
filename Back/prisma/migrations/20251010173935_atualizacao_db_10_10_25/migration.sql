/*
  Warnings:

  - You are about to drop the column `role` on the `Usuario` table. All the data in the column will be lost.
  - Added the required column `DataUpdate` to the `Comentario` table without a default value. This is not possible if the table is not empty.
  - Added the required column `Anonimato` to the `Denuncia` table without a default value. This is not possible if the table is not empty.
  - Added the required column `DataUpdate` to the `Denuncia` table without a default value. This is not possible if the table is not empty.
  - Added the required column `DataUpdate` to the `Noticia` table without a default value. This is not possible if the table is not empty.
  - Added the required column `IsAdmin` to the `Usuario` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Comentario" ADD COLUMN     "DataCriacao" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "DataUpdate" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "Denuncia" ADD COLUMN     "Anonimato" BOOLEAN NOT NULL,
ADD COLUMN     "DataCriacao" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "DataUpdate" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "mediasrc" TEXT;

-- AlterTable
ALTER TABLE "Noticia" ADD COLUMN     "DataCriacao" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "DataUpdate" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "Usuario" DROP COLUMN "role",
ADD COLUMN     "IsAdmin" BOOLEAN NOT NULL;

-- CreateTable
CREATE TABLE "Apoios" (
    "id" SERIAL NOT NULL,
    "idUsuario" INTEGER NOT NULL,
    "idDenuncia" INTEGER NOT NULL,

    CONSTRAINT "Apoios_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Reports" (
    "id" SERIAL NOT NULL,
    "idUsuario" INTEGER NOT NULL,
    "idDenuncia" INTEGER NOT NULL,

    CONSTRAINT "Reports_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Apoios" ADD CONSTRAINT "Apoios_idUsuario_fkey" FOREIGN KEY ("idUsuario") REFERENCES "Usuario"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Apoios" ADD CONSTRAINT "Apoios_idDenuncia_fkey" FOREIGN KEY ("idDenuncia") REFERENCES "Denuncia"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Reports" ADD CONSTRAINT "Reports_idUsuario_fkey" FOREIGN KEY ("idUsuario") REFERENCES "Usuario"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Reports" ADD CONSTRAINT "Reports_idDenuncia_fkey" FOREIGN KEY ("idDenuncia") REFERENCES "Denuncia"("id") ON DELETE CASCADE ON UPDATE CASCADE;
