/*
  Warnings:

  - You are about to drop the column `DataCriacao` on the `Comentario` table. All the data in the column will be lost.
  - You are about to drop the column `DataUpdate` on the `Comentario` table. All the data in the column will be lost.
  - You are about to drop the column `Anonimato` on the `Denuncia` table. All the data in the column will be lost.
  - You are about to drop the column `DataCriacao` on the `Denuncia` table. All the data in the column will be lost.
  - You are about to drop the column `DataUpdate` on the `Denuncia` table. All the data in the column will be lost.
  - You are about to drop the column `DataCriacao` on the `Noticia` table. All the data in the column will be lost.
  - You are about to drop the column `DataUpdate` on the `Noticia` table. All the data in the column will be lost.
  - You are about to drop the column `IsAdmin` on the `Usuario` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[idUsuario,idDenuncia]` on the table `Apoios` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[idUsuario,idDenuncia]` on the table `Reports` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `dataUpdate` to the `Comentario` table without a default value. This is not possible if the table is not empty.
  - Added the required column `anonimato` to the `Denuncia` table without a default value. This is not possible if the table is not empty.
  - Added the required column `dataUpdate` to the `Denuncia` table without a default value. This is not possible if the table is not empty.
  - Added the required column `dataUpdate` to the `Noticia` table without a default value. This is not possible if the table is not empty.
  - Added the required column `isAdmin` to the `Usuario` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Comentario" DROP COLUMN "DataCriacao",
DROP COLUMN "DataUpdate",
ADD COLUMN     "dataCriacao" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "dataUpdate" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "Denuncia" DROP COLUMN "Anonimato",
DROP COLUMN "DataCriacao",
DROP COLUMN "DataUpdate",
ADD COLUMN     "anonimato" BOOLEAN NOT NULL,
ADD COLUMN     "dataCriacao" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "dataUpdate" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "Noticia" DROP COLUMN "DataCriacao",
DROP COLUMN "DataUpdate",
ADD COLUMN     "dataCriacao" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "dataUpdate" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "Usuario" DROP COLUMN "IsAdmin",
ADD COLUMN     "isAdmin" BOOLEAN NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Apoios_idUsuario_idDenuncia_key" ON "Apoios"("idUsuario", "idDenuncia");

-- CreateIndex
CREATE UNIQUE INDEX "Reports_idUsuario_idDenuncia_key" ON "Reports"("idUsuario", "idDenuncia");
