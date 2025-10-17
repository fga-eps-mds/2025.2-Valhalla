/*
  Warnings:

  - You are about to drop the `Apoios` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Reports` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "public"."Apoios" DROP CONSTRAINT "Apoios_idDenuncia_fkey";

-- DropForeignKey
ALTER TABLE "public"."Apoios" DROP CONSTRAINT "Apoios_idUsuario_fkey";

-- DropForeignKey
ALTER TABLE "public"."Comentario" DROP CONSTRAINT "Comentario_idDenuncia_fkey";

-- DropForeignKey
ALTER TABLE "public"."Comentario" DROP CONSTRAINT "Comentario_idUsuario_fkey";

-- DropForeignKey
ALTER TABLE "public"."Denuncia" DROP CONSTRAINT "Denuncia_idUsuario_fkey";

-- DropForeignKey
ALTER TABLE "public"."Noticia" DROP CONSTRAINT "Noticia_idUsuario_fkey";

-- DropForeignKey
ALTER TABLE "public"."Reports" DROP CONSTRAINT "Reports_idDenuncia_fkey";

-- DropForeignKey
ALTER TABLE "public"."Reports" DROP CONSTRAINT "Reports_idUsuario_fkey";

-- DropIndex
DROP INDEX "public"."Usuario_email_key";

-- AlterTable
ALTER TABLE "Comentario" ADD COLUMN     "anonimato" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "dataDelete" TIMESTAMP(3);

-- AlterTable
ALTER TABLE "Denuncia" ADD COLUMN     "dataDelete" TIMESTAMP(3),
ALTER COLUMN "anonimato" SET DEFAULT false;

-- AlterTable
ALTER TABLE "Noticia" ADD COLUMN     "dataDelete" TIMESTAMP(3);

-- AlterTable
ALTER TABLE "Usuario" ADD COLUMN     "dataDelete" TIMESTAMP(3);

-- DropTable
DROP TABLE "public"."Apoios";

-- DropTable
DROP TABLE "public"."Reports";

-- CreateTable
CREATE TABLE "ApoiosDenuncia" (
    "id" SERIAL NOT NULL,
    "idUsuario" INTEGER NOT NULL,
    "idDenuncia" INTEGER NOT NULL,

    CONSTRAINT "ApoiosDenuncia_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ReportsDenuncia" (
    "id" SERIAL NOT NULL,
    "idUsuario" INTEGER NOT NULL,
    "idDenuncia" INTEGER NOT NULL,

    CONSTRAINT "ReportsDenuncia_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ApoiosComentario" (
    "id" SERIAL NOT NULL,
    "idUsuario" INTEGER NOT NULL,
    "idComentario" INTEGER NOT NULL,

    CONSTRAINT "ApoiosComentario_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ReportsComentario" (
    "id" SERIAL NOT NULL,
    "idUsuario" INTEGER NOT NULL,
    "idComentario" INTEGER NOT NULL,

    CONSTRAINT "ReportsComentario_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "ApoiosDenuncia_idUsuario_idDenuncia_key" ON "ApoiosDenuncia"("idUsuario", "idDenuncia");

-- CreateIndex
CREATE UNIQUE INDEX "ReportsDenuncia_idUsuario_idDenuncia_key" ON "ReportsDenuncia"("idUsuario", "idDenuncia");

-- CreateIndex
CREATE UNIQUE INDEX "ApoiosComentario_idUsuario_idComentario_key" ON "ApoiosComentario"("idUsuario", "idComentario");

-- CreateIndex
CREATE UNIQUE INDEX "ReportsComentario_idUsuario_idComentario_key" ON "ReportsComentario"("idUsuario", "idComentario");

-- CreateIndex //ADD MANUALMENTE
CREATE UNIQUE INDEX "Usuario_unique_active_email_idx" ON "Usuario"("email") WHERE "dataDelete" IS NULL;

-- AddForeignKey
ALTER TABLE "Denuncia" ADD CONSTRAINT "Denuncia_idUsuario_fkey" FOREIGN KEY ("idUsuario") REFERENCES "Usuario"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Comentario" ADD CONSTRAINT "Comentario_idUsuario_fkey" FOREIGN KEY ("idUsuario") REFERENCES "Usuario"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Comentario" ADD CONSTRAINT "Comentario_idDenuncia_fkey" FOREIGN KEY ("idDenuncia") REFERENCES "Denuncia"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Noticia" ADD CONSTRAINT "Noticia_idUsuario_fkey" FOREIGN KEY ("idUsuario") REFERENCES "Usuario"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ApoiosDenuncia" ADD CONSTRAINT "ApoiosDenuncia_idUsuario_fkey" FOREIGN KEY ("idUsuario") REFERENCES "Usuario"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ApoiosDenuncia" ADD CONSTRAINT "ApoiosDenuncia_idDenuncia_fkey" FOREIGN KEY ("idDenuncia") REFERENCES "Denuncia"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ReportsDenuncia" ADD CONSTRAINT "ReportsDenuncia_idUsuario_fkey" FOREIGN KEY ("idUsuario") REFERENCES "Usuario"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ReportsDenuncia" ADD CONSTRAINT "ReportsDenuncia_idDenuncia_fkey" FOREIGN KEY ("idDenuncia") REFERENCES "Denuncia"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ApoiosComentario" ADD CONSTRAINT "ApoiosComentario_idUsuario_fkey" FOREIGN KEY ("idUsuario") REFERENCES "Usuario"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ApoiosComentario" ADD CONSTRAINT "ApoiosComentario_idComentario_fkey" FOREIGN KEY ("idComentario") REFERENCES "Comentario"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ReportsComentario" ADD CONSTRAINT "ReportsComentario_idUsuario_fkey" FOREIGN KEY ("idUsuario") REFERENCES "Usuario"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ReportsComentario" ADD CONSTRAINT "ReportsComentario_idComentario_fkey" FOREIGN KEY ("idComentario") REFERENCES "Comentario"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
