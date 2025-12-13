/*
  Warnings:

  - You are about to drop the column `Descricao` on the `Comentario` table. All the data in the column will be lost.
  - You are about to drop the column `mediasrc` on the `Denuncia` table. All the data in the column will be lost.
  - You are about to drop the column `mediasrc` on the `Noticia` table. All the data in the column will be lost.
  - You are about to drop the column `admMaster` on the `Usuario` table. All the data in the column will be lost.
  - You are about to drop the column `isAdmin` on the `Usuario` table. All the data in the column will be lost.
  - You are about to drop the column `mediasrc` on the `Usuario` table. All the data in the column will be lost.
  - Added the required column `descricao` to the `Comentario` table without a default value. This is not possible if the table is not empty.
  - Added the required column `dataUpdate` to the `Usuario` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "TipoUsuario" AS ENUM ('COMUM', 'ADMIN', 'ADMINMASTER');

-- DropForeignKey
ALTER TABLE "public"."ApoiosComentario" DROP CONSTRAINT "ApoiosComentario_idComentario_fkey";

-- DropForeignKey
ALTER TABLE "public"."ApoiosComentario" DROP CONSTRAINT "ApoiosComentario_idUsuario_fkey";

-- DropForeignKey
ALTER TABLE "public"."ApoiosDenuncia" DROP CONSTRAINT "ApoiosDenuncia_idDenuncia_fkey";

-- DropForeignKey
ALTER TABLE "public"."ApoiosDenuncia" DROP CONSTRAINT "ApoiosDenuncia_idUsuario_fkey";

-- DropForeignKey
ALTER TABLE "public"."Comentario" DROP CONSTRAINT "Comentario_idDenuncia_fkey";

-- DropForeignKey
ALTER TABLE "public"."Comentario" DROP CONSTRAINT "Comentario_idUsuario_fkey";

-- DropForeignKey
ALTER TABLE "public"."Denuncia" DROP CONSTRAINT "Denuncia_idCategoria_fkey";

-- DropForeignKey
ALTER TABLE "public"."Denuncia" DROP CONSTRAINT "Denuncia_idUsuario_fkey";

-- DropForeignKey
ALTER TABLE "public"."Noticia" DROP CONSTRAINT "Noticia_idUsuario_fkey";

-- DropForeignKey
ALTER TABLE "public"."ReportsComentario" DROP CONSTRAINT "ReportsComentario_idComentario_fkey";

-- DropForeignKey
ALTER TABLE "public"."ReportsComentario" DROP CONSTRAINT "ReportsComentario_idUsuario_fkey";

-- DropForeignKey
ALTER TABLE "public"."ReportsDenuncia" DROP CONSTRAINT "ReportsDenuncia_idDenuncia_fkey";

-- DropForeignKey
ALTER TABLE "public"."ReportsDenuncia" DROP CONSTRAINT "ReportsDenuncia_idUsuario_fkey";

-- DropIndex
DROP INDEX "public"."Usuario_email_key";

-- AlterTable
ALTER TABLE "Comentario" DROP COLUMN "Descricao",
ADD COLUMN     "descricao" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Denuncia" DROP COLUMN "mediasrc",
ADD COLUMN     "mediaSrc" TEXT;

-- AlterTable
ALTER TABLE "Noticia" DROP COLUMN "mediasrc",
ADD COLUMN     "mediaSrc" TEXT;

-- AlterTable
ALTER TABLE "Usuario" DROP COLUMN "admMaster",
DROP COLUMN "isAdmin",
DROP COLUMN "mediasrc",
ADD COLUMN     "dataCriacao" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "dataUpdate" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "mediaSrc" TEXT,
ADD COLUMN     "tipo" "TipoUsuario" NOT NULL DEFAULT 'COMUM';

-- AddForeignKey
ALTER TABLE "Denuncia" ADD CONSTRAINT "Denuncia_idUsuario_fkey" FOREIGN KEY ("idUsuario") REFERENCES "Usuario"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Denuncia" ADD CONSTRAINT "Denuncia_idCategoria_fkey" FOREIGN KEY ("idCategoria") REFERENCES "Categoria"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Comentario" ADD CONSTRAINT "Comentario_idUsuario_fkey" FOREIGN KEY ("idUsuario") REFERENCES "Usuario"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Comentario" ADD CONSTRAINT "Comentario_idDenuncia_fkey" FOREIGN KEY ("idDenuncia") REFERENCES "Denuncia"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Noticia" ADD CONSTRAINT "Noticia_idUsuario_fkey" FOREIGN KEY ("idUsuario") REFERENCES "Usuario"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ApoiosDenuncia" ADD CONSTRAINT "ApoiosDenuncia_idUsuario_fkey" FOREIGN KEY ("idUsuario") REFERENCES "Usuario"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ApoiosDenuncia" ADD CONSTRAINT "ApoiosDenuncia_idDenuncia_fkey" FOREIGN KEY ("idDenuncia") REFERENCES "Denuncia"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ReportsDenuncia" ADD CONSTRAINT "ReportsDenuncia_idUsuario_fkey" FOREIGN KEY ("idUsuario") REFERENCES "Usuario"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ReportsDenuncia" ADD CONSTRAINT "ReportsDenuncia_idDenuncia_fkey" FOREIGN KEY ("idDenuncia") REFERENCES "Denuncia"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ApoiosComentario" ADD CONSTRAINT "ApoiosComentario_idUsuario_fkey" FOREIGN KEY ("idUsuario") REFERENCES "Usuario"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ApoiosComentario" ADD CONSTRAINT "ApoiosComentario_idComentario_fkey" FOREIGN KEY ("idComentario") REFERENCES "Comentario"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ReportsComentario" ADD CONSTRAINT "ReportsComentario_idUsuario_fkey" FOREIGN KEY ("idUsuario") REFERENCES "Usuario"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ReportsComentario" ADD CONSTRAINT "ReportsComentario_idComentario_fkey" FOREIGN KEY ("idComentario") REFERENCES "Comentario"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- Ajuste manual para Soft Delete no Email
DROP INDEX IF EXISTS "Usuario_email_key";
DROP INDEX IF EXISTS "Usuario_unique_active_email_idx";
CREATE UNIQUE INDEX "Usuario_unique_active_email_idx" ON "Usuario"("email") WHERE "dataDelete" IS NULL;